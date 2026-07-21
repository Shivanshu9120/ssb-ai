from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import Optional, List
import json
import asyncio
from uuid import UUID

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

    # 3. Add user prompt to messages database
    user_message = Message(
        chat_id=chat_id,
        role="user",
        message=request.message
    )
    session.add(user_message)
    session.commit()

    # 4. Semantically search context chunks
    context_str = ""
    citations = []
    try:
        chunks = Retriever.retrieve(request.message, top_k=5)
        context_parts = []
        for i, chunk in enumerate(chunks, 1):
            context_parts.append(f"[{i}] Source: {chunk['document']} (Page {chunk['page']})\nContent: {chunk['text']}")
            citations.append({
                "source": chunk["document"],
                "page": chunk["page"],
                "title": chunk["title"],
                "topic": chunk["topic"]
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
            return list(LLMService.generate_chat_stream(request.message, context_str, custom_api_key=x_gemini_api_key))

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
