from typing import List, Optional
from fastembed import TextEmbedding
from google import genai
from google.genai import types
from app.core.config import settings

# Lazy-loaded FastEmbed model instance (BAAI/bge-small-en-v1.5)
_fastembed_model: Optional[TextEmbedding] = None

def _get_fastembed_model() -> TextEmbedding:
    global _fastembed_model
    if _fastembed_model is None:
        _fastembed_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
    return _fastembed_model


# Backup Gemini client
gemini_client = genai.Client(
    api_key=settings.GEMINI_API_KEY,
    http_options=types.HttpOptions(api_version="v1"),
)

class EmbeddingService:
    @staticmethod
    def get_embedding(text: str) -> List[float]:
        """
        Generate 768D embedding for document chunks using local fastembed (0 API cost/quota),
        with fallback to Gemini API.
        """
        try:
            model = _get_fastembed_model()
            embeddings = list(model.embed([text]))
            return embeddings[0].tolist()
        except Exception as local_err:
            print(f"Local fastembed failed ({local_err}), falling back to Gemini API...")
            try:
                result = gemini_client.models.embed_content(
                    model="models/gemini-embedding-001",
                    contents=text,
                    config={"task_type": "retrieval_document", "output_dimensionality": 768}
                )
                return result.embeddings[0].values
            except Exception as gem_err:
                raise RuntimeError(f"Failed to generate document embedding: {str(gem_err)}")

    @staticmethod
    def get_query_embedding(text: str) -> List[float]:
        """
        Generate 768D embedding for search queries using local fastembed (0 API cost/quota),
        with fallback to Gemini API.
        """
        try:
            model = _get_fastembed_model()
            embeddings = list(model.embed([text]))
            return embeddings[0].tolist()
        except Exception as local_err:
            print(f"Local fastembed query failed ({local_err}), falling back to Gemini API...")
            try:
                result = gemini_client.models.embed_content(
                    model="models/gemini-embedding-001",
                    contents=text,
                    config={"task_type": "retrieval_query", "output_dimensionality": 768}
                )
                return result.embeddings[0].values
            except Exception as gem_err:
                raise RuntimeError(f"Failed to generate query embedding: {str(gem_err)}")

