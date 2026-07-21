import os
import sys
import uuid
from pinecone import Pinecone
from dotenv import load_dotenv

# Add parent directory to path to allow importing app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

from app.core.config import settings
from app.rag.loader import DocumentLoader
from app.rag.chunker import TextChunker
from app.services.embedding_service import EmbeddingService

# Subfolders to monitor by default
DEFAULT_KNOWLEDGE_TOPICS = [
    "psychology", "interview", "gto", "wat", "srt", "tat", 
    "lecturette", "current_affairs", "olq", "army", "navy", "airforce"
]

def get_knowledge_base_dir():
    return os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "knowledge")

def get_all_namespaces():
    """
    Returns a sorted list of all knowledge base topic folders (both default and custom).
    """
    base_path = get_knowledge_base_dir()
    os.makedirs(base_path, exist_ok=True)
    
    # Ensure default directories exist
    for topic in DEFAULT_KNOWLEDGE_TOPICS:
        topic_path = os.path.join(base_path, topic)
        os.makedirs(topic_path, exist_ok=True)

    namespaces = set(DEFAULT_KNOWLEDGE_TOPICS)
    for entry in os.listdir(base_path):
        full_path = os.path.join(base_path, entry)
        if os.path.isdir(full_path) and not entry.startswith("."):
            namespaces.add(entry)
            
    return sorted(list(namespaces))

def ensure_knowledge_directories():
    """
    Creates directories for raw knowledge files if they are missing.
    """
    base_path = get_knowledge_base_dir()
    all_namespaces = get_all_namespaces()
    for topic in all_namespaces:
        topic_path = os.path.join(base_path, topic)
        os.makedirs(topic_path, exist_ok=True)
        gitkeep_path = os.path.join(topic_path, ".gitkeep")
        if not os.listdir(topic_path):
            with open(gitkeep_path, "w") as f:
                f.write("")
    print(f"Verified and created all knowledge directories under: {base_path}")
    return base_path

def get_pinecone_index():
    """
    Returns an initialized Pinecone Index instance or None if unconfigured.
    """
    try:
        if not settings.PINECONE_API_KEY or not settings.PINECONE_INDEX_NAME:
            return None
        pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        return pc.Index(settings.PINECONE_INDEX_NAME)
    except Exception as e:
        print(f"Pinecone connection error: {str(e)}")
        return None

def delete_vectors_for_document(topic: str, filename: str):
    """
    Deletes all vector chunks from Pinecone corresponding to a specific document in a topic.
    """
    index = get_pinecone_index()
    if not index:
        return False
    try:
        index.delete(filter={"topic": topic, "document": filename})
        return True
    except Exception as e:
        print(f"Failed deleting vectors for {topic}/{filename}: {str(e)}")
        return False

def delete_vectors_for_namespace(topic: str):
    """
    Deletes all vector chunks from Pinecone corresponding to an entire topic namespace.
    """
    index = get_pinecone_index()
    if not index:
        return False
    try:
        index.delete(filter={"topic": topic})
        return True
    except Exception as e:
        print(f"Failed deleting vectors for namespace {topic}: {str(e)}")
        return False

def reindex_single_document(topic: str, filename: str) -> dict:
    """
    Parses, embeds, and upserts vectors for a single file. First removes existing vectors for this file.
    """
    base_path = get_knowledge_base_dir()
    file_path = os.path.join(base_path, topic, filename)
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File {filename} not found in topic {topic}")

    index = get_pinecone_index()
    if not index:
        raise RuntimeError("Pinecone index is not configured.")

    # 1. Purge existing vectors for file
    delete_vectors_for_document(topic, filename)

    # 2. Parse file
    pages = DocumentLoader.load_file(file_path)
    if not pages:
        return {"filename": filename, "chunks_count": 0, "message": "No text extracted from file."}

    vectors_to_upsert = []
    chunk_count = 0

    for page_idx, page in enumerate(pages):
        page_text = page["text"]
        page_num = page["page"]
        chunks = TextChunker.split_text(page_text)
        
        for chunk_idx, chunk in enumerate(chunks):
            chunk_count += 1
            vector_id = f"{topic}_{filename.replace('.', '_')}_p{page_num}_c{chunk_idx}_{str(uuid.uuid4())[:8]}"
            embedding = EmbeddingService.get_embedding(chunk)
            metadata = {
                "text": chunk,
                "title": filename.rsplit('.', 1)[0].replace('_', ' ').title(),
                "topic": topic,
                "document": filename,
                "page": page_num,
                "source": f"{topic}/{filename}"
            }
            vectors_to_upsert.append((vector_id, embedding, metadata))

    # Batch upsert
    batch_size = 50
    for i in range(0, len(vectors_to_upsert), batch_size):
        batch = vectors_to_upsert[i:i + batch_size]
        index.upsert(vectors=batch)

    return {"filename": filename, "topic": topic, "chunks_count": chunk_count, "message": "Successfully indexed document."}

def get_document_chunks_preview(topic: str, filename: str) -> list[dict]:
    """
    Loads document from disk and returns parsed text chunks for visual preview in frontend.
    """
    base_path = get_knowledge_base_dir()
    file_path = os.path.join(base_path, topic, filename)
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File {filename} not found under {topic}")

    pages = DocumentLoader.load_file(file_path)
    result_chunks = []
    total_idx = 0

    for page in pages:
        page_text = page["text"]
        page_num = page["page"]
        chunks = TextChunker.split_text(page_text)
        for chunk_idx, chunk in enumerate(chunks):
            total_idx += 1
            result_chunks.append({
                "id": f"chunk_{total_idx}",
                "chunk_index": chunk_idx + 1,
                "page": page_num,
                "char_length": len(chunk),
                "text": chunk
            })
    return result_chunks

def ingest_documents():
    """
    Scans files, chunks them, embeds them, and uploads to Pinecone index.
    """
    knowledge_dir = ensure_knowledge_directories()
    all_namespaces = get_all_namespaces()
    
    index = get_pinecone_index()
    if not index:
        print("Pinecone client uninitialized. Aborting ingestion.")
        return

    vectors_to_upsert = []
    batch_size = 50

    print("Scanning directories for files...")
    for topic in all_namespaces:
        topic_path = os.path.join(knowledge_dir, topic)
        if not os.path.exists(topic_path):
            continue
            
        for filename in os.listdir(topic_path):
            if filename.startswith(".") or filename == ".gitkeep":
                continue
                
            file_path = os.path.join(topic_path, filename)
            if not os.path.isfile(file_path):
                continue
                
            print(f"Ingesting file: {filename} from topic: {topic}")
            
            # 1. Parse File
            pages = DocumentLoader.load_file(file_path)
            if not pages:
                print(f"Skipping {filename}: No text content extracted.")
                continue
                
            # 2. Chunk text and prepare payloads
            for page_idx, page in enumerate(pages):
                page_text = page["text"]
                page_num = page["page"]
                
                chunks = TextChunker.split_text(page_text)
                for chunk_idx, chunk in enumerate(chunks):
                    # Generate unique ID for this vector chunk
                    vector_id = f"{topic}_{filename.replace('.', '_')}_p{page_num}_c{chunk_idx}_{str(uuid.uuid4())[:8]}"
                    
                    try:
                        # 3. Embed text chunk
                        embedding = EmbeddingService.get_embedding(chunk)
                        
                        # 4. Save metadata along with vector
                        metadata = {
                            "text": chunk,
                            "title": filename.rsplit('.', 1)[0].replace('_', ' ').title(),
                            "topic": topic,
                            "document": filename,
                            "page": page_num,
                            "source": f"{topic}/{filename}"
                        }
                        
                        vectors_to_upsert.append((vector_id, embedding, metadata))
                        
                        # Batch upsert to Pinecone
                        if len(vectors_to_upsert) >= batch_size:
                            print(f"Upserting batch of {len(vectors_to_upsert)} vectors to Pinecone...")
                            index.upsert(vectors=vectors_to_upsert)
                            vectors_to_upsert = []
                            
                    except Exception as embed_err:
                        print(f"Error creating vector for chunk {chunk_idx} of {filename}: {str(embed_err)}")

    # Upsert remaining vectors
    if vectors_to_upsert:
        print(f"Upserting final batch of {len(vectors_to_upsert)} vectors...")
        try:
            index.upsert(vectors=vectors_to_upsert)
            print("Upload complete!")
        except Exception as upsert_err:
            print(f"Failed upserting final batch: {str(upsert_err)}")
    else:
        print("No new vectors to upload.")

if __name__ == "__main__":
    # Ensure folders are ready immediately
    if len(sys.argv) > 1 and sys.argv[1] == "--setup-only":
        ensure_knowledge_directories()
    else:
        print("Starting ingestion pipeline...")
        ingest_documents()

