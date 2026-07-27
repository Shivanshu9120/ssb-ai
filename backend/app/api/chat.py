from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import Optional, List
import json
import asyncio
import os
import re
from uuid import UUID

def clean_document_title(document: str, title: str = None) -> str:
    """
    Sanitizes raw document filenames into clean, human-readable titles.
    Example: '1728392_ssb_psychology_guide.pdf' -> 'SSB Psychology Guide'
    """
    if title and title.strip() and title.lower() != "untitled":
        clean_title = title.strip()
    else:
        clean_title = document or "SSB Knowledge Base"

    clean_title = os.path.basename(clean_title)
    clean_title = os.path.splitext(clean_title)[0]
    clean_title = re.sub(r'^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}_?', '', clean_title, flags=re.IGNORECASE)
    clean_title = re.sub(r'^\d+[\-_]', '', clean_title)
    clean_title = clean_title.replace('_', ' ').replace('-', ' ').strip()
    
    words = clean_title.split()
    formatted_words = []
    for w in words:
        if w.lower() in ['ssb', 'tat', 'wat', 'srt', 'gto', 'olq', 'olqs', 'iaf', 'ota', 'ima']:
            formatted_words.append(w.upper())
        else:
            formatted_words.append(w.capitalize())
            
    return " ".join(formatted_words) if formatted_words else "SSB Knowledge Base"

from app.database.connection import get_session
from app.core.security import get_current_user
from app.models.models import User, Chat, Message
from app.schemas.schemas import ChatResponse, MessageResponse
from app.services.token_service import TokenService
from app.services.llm_service import LLMService
from app.rag.retriever import Retriever

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatRequest(BaseModel):
    message: str
    chat_id: Optional[UUID] = None

@router.get("/history", response_model=List[ChatResponse])
def get_chat_history(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get all chat conversations created by the current user.
    """
    statement = select(Chat).where(Chat.user_id == current_user.id).order_by(Chat.created_at.desc())
    chats = session.exec(statement).all()
    return chats

@router.get("/{chat_id}", response_model=List[MessageResponse])
def get_chat_messages(
    chat_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get all message logs inside a specific chat conversation.
    """
    chat = session.get(Chat, chat_id)
    if not chat or chat.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Chat conversation not found.")
    return chat.messages

@router.delete("/{chat_id}")
def delete_chat(
    chat_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a chat conversation and cascadingly remove all associated messages.
    """
    chat = session.get(Chat, chat_id)
    if not chat or chat.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Chat conversation not found.")
    session.delete(chat)
    session.commit()
    return {"message": "Chat conversation successfully deleted."}

@router.post("", response_class=StreamingResponse)
async def start_chat_stream(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-Api-Key")
):
    """
    Post a message to an ongoing chat or create a new conversation, returning a streaming AI response.
    """
    # 1. Enforce usage limits for Free tier
    if TokenService.check_limit_exceeded(current_user.id, current_user.plan, session):
        raise HTTPException(
            status_code=429,
            detail="Daily question limit reached. Upgrade to Premium for unlimited questions!"
        )

    # 2. Fetch or create the chat session
    chat_id = request.chat_id
    if not chat_id:
        # Auto-generate title from prompt snippet
        title = request.message[:35] + "..." if len(request.message) > 35 else request.message
        chat = Chat(user_id=current_user.id, title=title)
        session.add(chat)
        session.commit()
        session.refresh(chat)
        chat_id = chat.id
    else:
        chat = session.get(Chat, chat_id)
        if not chat or chat.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Chat conversation not found.")

    # 2.5 Extract previous thread message history (up to last 6 messages / 3 interaction turns)
    history = []
    if chat and chat.messages:
        sorted_messages = sorted(chat.messages, key=lambda m: m.created_at)
        recent_messages = sorted_messages[-6:]
        for m in recent_messages:
            history.append({
                "role": m.role,
                "message": m.message
            })

    # 3. Add user prompt to messages database
    user_message = Message(
        chat_id=chat_id,
        role="user",
        message=request.message
    )
    session.add(user_message)
    session.commit()

    # 4. Context-aware semantic RAG search
    rag_query = request.message
    # If the user prompt is brief (< 6 words) and we have prior thread history, combine with recent prompt for vector search
    if history and len(request.message.split()) < 6:
        prior_user_prompts = [h["message"] for h in history if h["role"] == "user"]
        if prior_user_prompts:
            rag_query = f"{prior_user_prompts[-1]} {request.message}"

    context_str = ""
    citations = []
    try:
        chunks = Retriever.retrieve(rag_query, top_k=5)
        context_parts = []
        for i, chunk in enumerate(chunks, 1):
            clean_title = clean_document_title(chunk.get("document"), chunk.get("title"))
            context_parts.append(f"[{i}] Reference: {clean_title} (Page {chunk['page']})\nContent: {chunk['text']}")
            citations.append({
                "source": chunk.get("document", "Knowledge Base"),
                "page": chunk.get("page", 1),
                "title": clean_title,
                "topic": chunk.get("topic", "General")
            })
        context_str = "\n\n".join(context_parts)
    except Exception as ret_err:
        print(f"Retrieval failed (degraded mode): {str(ret_err)}")
        pass

    # 5. Stream response and save transaction metadata on close
    async def event_generator():
        # First SSE payload sends initial configuration & sources
        init_payload = {
            "chat_id": str(chat_id),
            "citations": citations
        }
        yield f"data: {json.dumps({'init': init_payload})}\n\n"

        assistant_message_content = ""
        prompt_tokens = 0
        completion_tokens = 0
        model_used = "gemini-2.0-flash"

        # Collect all SSE events from the blocking LLM call in a thread
        def run_llm():
            return list(LLMService.generate_chat_stream(
                request.message,
                context_str,
                history=history,
                custom_api_key=x_gemini_api_key
            ))

        sse_events = await asyncio.to_thread(run_llm)

        # Stream each event to client
        for sse_event in sse_events:
            if sse_event.startswith("data: "):
                try:
                    payload = json.loads(sse_event[6:].strip())
                    if "text" in payload:
                        assistant_message_content += payload["text"]
                    elif "metadata" in payload:
                        prompt_tokens = payload["metadata"]["prompt_tokens"]
                        completion_tokens = payload["metadata"]["completion_tokens"]
                        model_used = payload["metadata"]["model"]
                except Exception:
                    pass
            yield sse_event

        # Save LLM output and record daily token usage metrics
        if assistant_message_content:
            try:
                assistant_message = Message(
                    chat_id=chat_id,
                    role="assistant",
                    message=assistant_message_content,
                    prompt_tokens=prompt_tokens,
                    completion_tokens=completion_tokens,
                    model=model_used
                )
                session.add(assistant_message)
                TokenService.log_usage(
                    user_uuid=current_user.id,
                    prompt_tokens=prompt_tokens,
                    completion_tokens=completion_tokens,
                    session=session
                )
                session.commit()
            except Exception as db_err:
                print(f"Failed logging transaction to DB: {str(db_err)}")

    return StreamingResponse(event_generator(), media_type="text/event-stream")
