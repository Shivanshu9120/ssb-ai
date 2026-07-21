from pinecone import Pinecone
from app.core.config import settings
from app.services.embedding_service import EmbeddingService

# Initialize Pinecone client
# Note: In development without keys set yet, this might raise an error if initialized globally.
# We initialize inside the functions or wrap in try/except to avoid crash during server startup.
class Retriever:
    @staticmethod
    def retrieve(query: str, top_k: int = 5) -> list[dict]:
        """
        Retrieves the top_k matching document chunks from Pinecone.
        """
        try:
            # Initialize connection inside retrieve to allow server to start even if keys are not ready
            pc = Pinecone(api_key=settings.PINECONE_API_KEY)
            index = pc.Index(settings.PINECONE_INDEX_NAME)
            
            # Get 768D query embedding
            query_vector = EmbeddingService.get_query_embedding(query)
            
            # Query Pinecone Index
            response = index.query(
                vector=query_vector,
                top_k=top_k,
                include_metadata=True
            )
            
            # Parse responses
            results = []
            for match in response.get("matches", []):
                metadata = match.get("metadata", {})
                results.append({
                    "id": match.get("id"),
                    "score": match.get("score"),
                    "text": metadata.get("text", ""),
                    "title": metadata.get("title", "Untitled"),
                    "topic": metadata.get("topic", "General"),
                    "document": metadata.get("document", "Unknown"),
                    "page": metadata.get("page", 0),
                    "source": metadata.get("source", "Unknown Source")
                })
            return results
        except Exception as e:
            print(f"Pinecone retrieval failed: {str(e)}")
            # Raise custom error which can be caught in API router to return graceful fallback
            raise RuntimeError("Knowledge base is currently unavailable.")
