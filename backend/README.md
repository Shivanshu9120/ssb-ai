# SSB Mentor AI — Backend API

FastAPI service powering vector search (Pinecone), LLM orchestration (Google Gemini API), PIQ document parsing, and database management (Supabase PostgreSQL).

For complete project setup and architecture details, see the [Root README](../README.md).

## Local Development

```bash
# Set up virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\Activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start dev server
uvicorn app.main:app --reload --port 8000
```

## Environment Variables (.env)

```env
ENV=development
PORT=8000
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=ssb-knowledge-base
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Primary Routes

- `GET /api/health` — Service health status
- `POST /api/chat/` — RAG query & AI mentor conversation
- `POST /api/piq_extract/` — PIQ PDF text extraction & schema parsing
- `GET /api/usage/` — User token usage & limits
- `GET /api/admin/` — System analytics & ingestion status

## Testing

```bash
pytest
```
