import json
import requests
from google import genai
from google.genai import types
from app.core.config import settings

default_gemini_client = genai.Client(
    api_key=settings.GEMINI_API_KEY,
    http_options=types.HttpOptions(api_version="v1"),
)

SYSTEM_PROMPT = """You are an expert SSB (Services Selection Board) Mentor. Your role is to help candidates prepare for their SSB exams (Army, Navy, Air Force) by focusing on developing the 15 Officer Like Qualities (OLQs).

When answering questions:
1. Ground your answers in the provided knowledge base context as much as possible.
2. If the context contains the answer, cite the source file and page numbers clearly.
3. If the context is insufficient, state: "My knowledge base doesn't have specific details on this, but based on general SSB guidelines..." and provide structured, helpful advice.
4. Encourage critical thinking, discipline, and the specific attributes of leadership, teamwork, and psychological stamina required by the armed forces.
"""

OPENROUTER_FALLBACK_MODELS = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemma-2-9b-it:free",
    "qwen/qwen-2.5-72b-instruct:free"
]

class LLMService:
    @staticmethod
    def generate_chat_stream(prompt: str, context_str: str = "", history: list = None, custom_api_key: str = None):
        """
        Generates a streaming response with automatic multi-provider fallback and multi-turn thread history:
        1. Gemini 2.0 Flash (using custom key if provided, or default GEMINI_API_KEY)
        2. Groq Free API (if GROQ_API_KEY is configured)
        3. OpenRouter Free Models
        """
        final_prompt = prompt
        if context_str:
            final_prompt = f"Context from Knowledge Base:\n{context_str}\n\nCandidate Question:\n{prompt}"

        # Construct Gemini multi-turn contents array
        gemini_contents = []
        if history:
            for item in history:
                gemini_role = "model" if item["role"] == "assistant" else "user"
                gemini_contents.append({
                    "role": gemini_role,
                    "parts": [{"text": item["message"]}]
                })
        gemini_contents.append({
            "role": "user",
            "parts": [{"text": final_prompt}]
        })

        # Construct OpenAI-compatible messages array for Groq and OpenRouter
        openai_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        if history:
            for item in history:
                openai_messages.append({
                    "role": item["role"],
                    "content": item["message"]
                })
        openai_messages.append({
            "role": "user",
            "content": final_prompt
        })

        # -------------------------------------------------------------
        # Provider 1: Gemini 2.0 Flash
        # -------------------------------------------------------------
        try:
            active_client = default_gemini_client
            if custom_api_key:
                active_client = genai.Client(
                    api_key=custom_api_key,
                    http_options=types.HttpOptions(api_version="v1"),
                )

            response = active_client.models.generate_content_stream(
                model="models/gemini-2.0-flash",
                contents=gemini_contents,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                )
            )

            prompt_tokens = 0
            completion_tokens = 0

            for chunk in response:
                try:
                    if chunk.text:
                        yield f"data: {json.dumps({'text': chunk.text})}\n\n"
                    if chunk.usage_metadata:
                        if chunk.usage_metadata.prompt_token_count:
                            prompt_tokens = chunk.usage_metadata.prompt_token_count
                        if chunk.usage_metadata.candidates_token_count:
                            completion_tokens = chunk.usage_metadata.candidates_token_count
                except (ValueError, AttributeError):
                    continue

            metadata = {
                "prompt_tokens": prompt_tokens or len(final_prompt) // 4,
                "completion_tokens": completion_tokens or 100,
                "model": "gemini-2.0-flash"
            }
            yield f"data: {json.dumps({'metadata': metadata})}\n\n"
            return

        except Exception as gem_err:
            print(f"Gemini API error ({str(gem_err)[:120]}...). Failover to backup provider...")

        # -------------------------------------------------------------
        # Provider 2: Groq API (if configured)
        # -------------------------------------------------------------
        if settings.GROQ_API_KEY:
            try:
                headers = {
                    "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                    "Content-Type": "application/json"
                }
                body = {
                    "model": "llama-3.3-70b-versatile",
                    "messages": openai_messages
                }
                res = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=body, timeout=20)
                if res.status_code == 200:
                    data = res.json()
                    answer = data["choices"][0]["message"]["content"]
                    yield f"data: {json.dumps({'text': answer})}\n\n"
                    usage = data.get("usage", {})
                    metadata = {
                        "prompt_tokens": usage.get("prompt_tokens", len(final_prompt) // 4),
                        "completion_tokens": usage.get("completion_tokens", len(answer) // 4),
                        "model": "llama-3.3-70b-versatile (Groq)"
                    }
                    yield f"data: {json.dumps({'metadata': metadata})}\n\n"
                    return
                else:
                    print(f"Groq API error status {res.status_code}: {res.text[:100]}")
            except Exception as groq_err:
                print(f"Groq API call failed: {str(groq_err)}")

        # -------------------------------------------------------------
        # Provider 3: OpenRouter Free Models Fallback
        # -------------------------------------------------------------
        for model in OPENROUTER_FALLBACK_MODELS:
            try:
                openrouter_key = settings.OPENROUTER_API_KEY
                headers = {
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://ssb-ai-rag.local",
                    "X-Title": "SSB AI Mentor",
                }
                if openrouter_key:
                    headers["Authorization"] = f"Bearer {openrouter_key}"

                body = {
                    "model": model,
                    "messages": openai_messages,
                    "stream": False
                }

                res = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=body, timeout=20)
                if res.status_code == 200:
                    data = res.json()
                    answer = data["choices"][0]["message"]["content"]
                    yield f"data: {json.dumps({'text': answer})}\n\n"
                    
                    usage = data.get("usage", {})
                    metadata = {
                        "prompt_tokens": usage.get("prompt_tokens", len(final_prompt) // 4),
                        "completion_tokens": usage.get("completion_tokens", len(answer) // 4),
                        "model": model
                    }
                    yield f"data: {json.dumps({'metadata': metadata})}\n\n"
                    return
            except Exception:
                pass

        # -------------------------------------------------------------
        # Final Fallback Message
        # -------------------------------------------------------------
        yield f"data: {json.dumps({'error': 'Gemini free quota is cooling down (~60s). Please wait 1 minute and retry, or provide a custom Gemini API key.'})}\n\n"


