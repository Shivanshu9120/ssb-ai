from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
import shutil
import os
import re
from datetime import datetime

from app.core.security import get_current_user
from app.models.models import User
from ingestion.ingest import (
    get_all_namespaces,
    get_knowledge_base_dir,
    delete_vectors_for_document,
    delete_vectors_for_namespace,
    reindex_single_document,
    get_document_chunks_preview,
    get_pinecone_index
)

router = APIRouter(prefix="/documents", tags=["Admin / Documents"])

class CreateNamespaceRequest(BaseModel):
    name: str = Field(..., description="Namespace topic name (alphanumeric and underscores)")

class RenameNamespaceRequest(BaseModel):
    new_name: str = Field(..., description="New namespace topic name")

def verify_admin(current_user: User = Depends(get_current_user)):
    """
    Ensure the user is authorized to perform admin actions.
    For the MVP, we grant access to all logged-in users.
    """
    return current_user

def format_file_size(size_in_bytes: int) -> str:
    if size_in_bytes < 1024:
        return f"{size_in_bytes} B"
    elif size_in_bytes < 1024 * 1024:
        return f"{size_in_bytes / 1024:.1f} KB"
    else:
        return f"{size_in_bytes / (1024 * 1024):.2f} MB"

@router.get("/namespaces")
def list_namespaces(current_user: User = Depends(verify_admin)):
    """
    List all knowledge base namespaces (topics) along with contained files, file sizes, and index statistics.
    """
    base_dir = get_knowledge_base_dir()
    namespaces_list = get_all_namespaces()
    
    # Try fetching total Pinecone vector count if available
    total_vectors = 0
    pinecone_available = False
    try:
        index = get_pinecone_index()
        if index:
            stats = index.describe_index_stats()
            total_vectors = stats.get("total_vector_count", 0)
            pinecone_available = True
    except Exception as e:
        print(f"Could not fetch Pinecone index stats: {e}")

    result_namespaces = []
    total_documents_count = 0
    total_kb_size_bytes = 0

    for topic in namespaces_list:
        topic_dir = os.path.join(base_dir, topic)
        documents = []
        topic_size_bytes = 0

        if os.path.exists(topic_dir):
            for filename in sorted(os.listdir(topic_dir)):
                if filename.startswith(".") or filename == ".gitkeep":
                    continue
                file_path = os.path.join(topic_dir, filename)
                if os.path.isfile(file_path):
                    stat = os.stat(file_path)
                    size = stat.st_size
                    mtime = datetime.fromtimestamp(stat.st_mtime).isoformat()
                    ext = os.path.splitext(filename)[1].lower().replace('.', '')
                    
                    topic_size_bytes += size
                    total_documents_count += 1

                    documents.append({
                        "filename": filename,
                        "extension": ext,
                        "size_bytes": size,
                        "size_formatted": format_file_size(size),
                        "modified_at": mtime,
                        "topic": topic
                    })

        total_kb_size_bytes += topic_size_bytes

        result_namespaces.append({
            "topic": topic,
            "document_count": len(documents),
            "total_size_bytes": topic_size_bytes,
            "total_size_formatted": format_file_size(topic_size_bytes),
            "documents": documents
        })

    return {
        "summary": {
            "total_namespaces": len(result_namespaces),
            "total_documents": total_documents_count,
            "total_size_bytes": total_kb_size_bytes,
            "total_size_formatted": format_file_size(total_kb_size_bytes),
            "total_vector_chunks": total_vectors,
            "pinecone_available": pinecone_available
        },
        "namespaces": result_namespaces
    }

@router.post("/namespaces")
def create_namespace(
    payload: CreateNamespaceRequest,
    current_user: User = Depends(verify_admin)
):
    """
    Create a new knowledge base namespace/topic directory.
    """
    clean_name = payload.name.strip().lower().replace(' ', '_')
    if not re.match(r'^[a-z0-9_-]+$', clean_name):
        raise HTTPException(status_code=400, detail="Invalid namespace name. Use alphanumeric characters and underscores.")

    base_dir = get_knowledge_base_dir()
    topic_dir = os.path.join(base_dir, clean_name)
    if os.path.exists(topic_dir):
        raise HTTPException(status_code=400, detail=f"Namespace '{clean_name}' already exists.")

    os.makedirs(topic_dir, exist_ok=True)
    gitkeep = os.path.join(topic_dir, ".gitkeep")
    with open(gitkeep, "w") as f:
        f.write("")

    return {"message": f"Successfully created namespace '{clean_name}'.", "topic": clean_name}

@router.put("/namespaces/{topic}")
def rename_namespace(
    topic: str,
    payload: RenameNamespaceRequest,
    current_user: User = Depends(verify_admin)
):
    """
    Rename an existing namespace topic directory.
    """
    base_dir = get_knowledge_base_dir()
    old_dir = os.path.join(base_dir, topic)
    if not os.path.exists(old_dir):
        raise HTTPException(status_code=404, detail=f"Namespace '{topic}' not found.")

    new_clean_name = payload.new_name.strip().lower().replace(' ', '_')
    if not re.match(r'^[a-z0-9_-]+$', new_clean_name):
        raise HTTPException(status_code=400, detail="Invalid new name. Use alphanumeric characters and underscores.")

    new_dir = os.path.join(base_dir, new_clean_name)
    if os.path.exists(new_dir) and topic != new_clean_name:
        raise HTTPException(status_code=400, detail=f"Target namespace '{new_clean_name}' already exists.")

    try:
        # Purge Pinecone vectors for old topic name
        delete_vectors_for_namespace(topic)
        os.rename(old_dir, new_dir)
        return {"message": f"Renamed namespace '{topic}' to '{new_clean_name}'. Please trigger indexing to re-embed vectors.", "old_topic": topic, "new_topic": new_clean_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to rename namespace: {str(e)}")

@router.delete("/namespaces/{topic}")
def delete_namespace(
    topic: str,
    current_user: User = Depends(verify_admin)
):
    """
    Delete an entire namespace topic folder, all documents inside, and all associated vectors in Pinecone.
    """
    base_dir = get_knowledge_base_dir()
    topic_dir = os.path.join(base_dir, topic)
    if not os.path.exists(topic_dir):
        raise HTTPException(status_code=404, detail=f"Namespace '{topic}' not found.")

    try:
        # 1. Purge Pinecone vectors for this namespace
        delete_vectors_for_namespace(topic)
        # 2. Remove folder from disk
        shutil.rmtree(topic_dir)
        return {"message": f"Successfully deleted namespace '{topic}' and purged vector embeddings."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed deleting namespace: {str(e)}")

@router.post("/upload")
def upload_document(
    topic: str,
    file: UploadFile = File(...),
    current_user: User = Depends(verify_admin)
):
    """
    Upload a document (PDF, DOCX, TXT, MD) to the knowledge base category.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".docx", ".txt", ".md"]:
        raise HTTPException(status_code=400, detail="Unsupported format. Only PDF, DOCX, TXT, and MD are supported.")

    base_dir = get_knowledge_base_dir()
    topic_dir = os.path.join(base_dir, topic)
    os.makedirs(topic_dir, exist_ok=True)

    file_path = os.path.join(topic_dir, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"message": f"Successfully uploaded {file.filename} to '{topic}' knowledge folder."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write file to disk: {str(e)}")

@router.delete("/namespaces/{topic}/documents/{filename}")
def delete_document(
    topic: str,
    filename: str,
    current_user: User = Depends(verify_admin)
):
    """
    Delete a specific document from disk and purge its vectors from Pinecone.
    """
    base_dir = get_knowledge_base_dir()
    file_path = os.path.join(base_dir, topic, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Document '{filename}' not found under topic '{topic}'.")

    try:
        # Purge Pinecone vectors
        delete_vectors_for_document(topic, filename)
        # Remove file from disk
        os.remove(file_path)
        return {"message": f"Successfully deleted '{filename}' from '{topic}'."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed deleting document: {str(e)}")

@router.post("/namespaces/{topic}/documents/{filename}/reindex")
def reindex_document(
    topic: str,
    filename: str,
    current_user: User = Depends(verify_admin)
):
    """
    Re-parse, chunk, embed, and upsert vectors for a single file.
    """
    try:
        res = reindex_single_document(topic, filename)
        return res
    except FileNotFoundError as fnf:
        raise HTTPException(status_code=404, detail=str(fnf))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Re-indexing failed: {str(e)}")

@router.get("/namespaces/{topic}/documents/{filename}/chunks")
def get_document_chunks(
    topic: str,
    filename: str,
    current_user: User = Depends(verify_admin)
):
    """
    Get parsed text chunks for a document for preview in the UI.
    """
    try:
        chunks = get_document_chunks_preview(topic, filename)
        return {"topic": topic, "filename": filename, "total_chunks": len(chunks), "chunks": chunks}
    except FileNotFoundError as fnf:
        raise HTTPException(status_code=404, detail=str(fnf))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed fetching chunks: {str(e)}")

@router.post("/index")
def trigger_indexing(
    current_user: User = Depends(verify_admin)
):
    """
    Trigger the RAG pipeline to process all files in the knowledge base and sync vectors with Pinecone.
    """
    try:
        from ingestion.ingest import ingest_documents
        ingest_documents()
        return {"message": "Knowledge base vector indexing completed successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Indexing failed: {str(e)}")
