# SSB Mentor AI

An AI-powered preparation platform for Services Selection Board (SSB) candidates. SSB Mentor AI combines Retrieval-Augmented Generation (RAG) over official SSB testing guidelines with automated Personal Information Questionnaire (PIQ) parsing to provide realistic mock interviews, psychological test feedback, and Officer Like Qualities (OLQ) evaluations.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.10%2B-blue)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/next.js-16-black)](https://nextjs.org/)

---

## System Architecture

```mermaid
flowchart TD
    subgraph Frontend ["Frontend (Next.js 16)"]
        UI[Dashboard & Chat UI]
        PIQ_Upload[PIQ Upload & PDF Generator]
    end

    subgraph Backend ["Backend (FastAPI)"]
        API[FastAPI Router]
        PARSER[PIQ Extraction Engine]
        RAG[RAG Query Engine]
    end

    subgraph Infrastructure ["Data & AI Services"]
        Pinecone[(Pinecone Vector DB)]
        Supabase[(PostgreSQL & Auth)]
        Gemini[Google Gemini API]
    end

    UI --> API
    PIQ_Upload --> API
    API --> PARSER --> Supabase
    API --> RAG
    RAG -->|Vector Search| Pinecone
    RAG -->|Context + Prompt| Gemini
    Gemini --> API --> UI
```

---

## Features

- **RAG-Grounded Mock Interviews:** Generates interview questions aligned with official SSB procedures (Stage 1 & Stage 2) and evaluates candidate answers against the 15 Officer Like Qualities (OLQs).
- **PIQ Document Parsing:** Parses candidate PIQ PDFs (`pdfplumber`/`pypdf`) to extract educational background, sports, responsibilities, and family details.
- **Personalized Context Toggle:** Integrates candidate PIQ data into live chat sessions so the AI interviewer asks tailored questions based on your background.
- **5-Day SSB Timeline Tracker:** Interactive breakdown and milestone tracker covering Screening, OIR, PPDT, WAT, TAT, SRT, GTO, and Personal Interview.
- **Knowledge Ingestion Pipeline:** Modular script to chunk and embed SSB reference literature into Pinecone using FastEmbed.
- **Analytics & Token Usage:** Real-time token consumption tracking, user rate limits, and an admin dashboard for system monitoring.

---

## Tech Stack

| Component | Technology |
| --- | --- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, `@react-pdf/renderer` |
| **Backend** | FastAPI, Python 3.10+, SQLModel / SQLAlchemy, Pydantic v2 |
| **AI / RAG** | Google Gemini API (`google-genai`), Pinecone Vector DB, FastEmbed |
| **Database & Auth** | Supabase (PostgreSQL), Supabase Auth |

---

## Project Structure

```text
.
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints (chat, piq_extract, user, admin, usage)
│   │   ├── core/         # App configuration & environment settings
│   │   ├── database/     # DB connection & SQLModel session management
│   │   ├── models/       # SQLModel database schemas
│   │   ├── rag/          # Vector search & context retrieval logic
│   │   ├── services/     # Gemini API integration & business logic
│   │   └── main.py       # FastAPI entrypoint
│   ├── ingestion/        # Vector embedding ingestion script
│   └── requirements.txt
└── frontend/
    ├── app/              # Next.js App Router pages (chat, piq, timeline, study, billing)
    ├── components/       # UI components
    ├── context/          # React context providers
    ├── lib/              # Supabase client & utilities
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Accounts/API Keys: Google Gemini API, Pinecone Vector DB, Supabase (PostgreSQL & Auth)

---

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/your-username/ssb-ai.git
cd ssb-ai
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\Activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
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

Start the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```
API docs available at `http://localhost:8000/docs`.

#### 3. Frontend Setup
In a separate terminal:
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the development server:
```bash
npm run dev
```
Application will be running at `http://localhost:3000`.

---

### Ingesting Study Materials into Pinecone

To populate your Pinecone vector index with reference materials:
```bash
cd backend
python -m ingestion.ingest_documents
```

---

## Roadmap

- [ ] **Voice-based Mock Interview:** Live speech-to-text and text-to-speech audio interviews.
- [ ] **PPDT & TAT Picture Perception Practice:** Timed image-based story writing module with automated evaluation.
- [ ] **WAT & SRT Automated Scoring:** Rapid evaluation for Word Association and Situation Reaction Tests.
- [ ] **GTO Simulation Module:** AI-driven group discussion and reasoning simulations.
- [ ] **Mobile App:** Cross-platform mobile version in React Native.

---

## Contributing

Contributions are welcome. Please follow these steps:

1. **Fork the repo** and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes** and verify tests/linting:
   - Backend: `pytest`
   - Frontend: `npm run lint`
3. **Commit with standard messages:**
   ```bash
   git commit -m "feat(api): add voice processing endpoint"
   ```
4. **Push to your fork** and open a Pull Request explaining your changes.

For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is licensed under the [MIT License](LICENSE).
