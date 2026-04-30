# 📑 InterviewPrep AI - Project Overview

## 🎯 Goal
A production-ready full-stack application that provides AI-generated interview preparation tailored to specific job descriptions.

---

## 🏗️ Technical Architecture

### 🛡️ Core Technologies
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: SQLite (via `better-sqlite3`)
- **AI**: Groq API (Llama-3.3-70b-versatile)

### 📂 Directory Structure
```text
interview-prep-ai/
├── client/                # React App
│   ├── src/
│   │   ├── components/    # UI Building Blocks
│   │   ├── pages/         # View Templates (Home, Practice, Mock, Results)
│   │   ├── hooks/         # API & Logic abstractions
│   │   └── utils/         # Configs
├── server/                # Express API
│   ├── routes/            # API Endpoints
│   ├── services/          # Groq AI Service
│   ├── db/                # SQLite initialization & Schema
│   └── middleware/        # Global error handling
```

---

## 🚀 Implemented Features

### 1. Smart Question Engine
- **JD Parsing**: Extracts role requirements from pasted text.
- **Categorization**: Mixes Technical, Behavioral, and System Design questions.
- **Difficulty Scaling**: Balances Easy, Medium, and Hard questions (3/4/3 split).

### 2. Mock Interview System
- **Progress Tracking**: Real-time progress bar.
- **Auto-Resume**: Remembers where the user left off if they exit.
- **Skip Counter**: Tracks skipped questions for later review.

### 3. AI Evaluation & Results
- **Instant Scoring**: 1-10 scoring with detailed feedback.
- **Model Answers**: Provides a high-quality example answer for every question.
- **Performance Summary**: A dedicated dashboard showing average score and breakdown.

### 4. User Experience Polish
- **Draft Persistence**: Saves JD input to `localStorage` to prevent data loss.
- **Input Guardrails**: Prevents gibberish or repetitive text from being processed.
- **Premium Aesthetics**: Dark mode with subtle gradients and smooth transitions.

---

## 🛠️ Environment Configuration
The project uses `.env` files for security:
- `GROQ_API_KEY`: Required for all AI operations.
- `PINECONE_API_KEY`: Provisioned for future vector search capabilities.
- `MONGODB_URI`: Provisioned for future cloud database migration.

---

## 🗺️ Roadmap & Future Plans
- [ ] **UI Overhaul**: Move from "AI Dashboard" to "Editorial/Premium" aesthetic.
- [ ] **Audio/Video Mock**: Integration of speech-to-text for more realistic practice.
- [ ] **Resume Upload**: Allow users to upload PDFs instead of pasting text.
- [ ] **Analytics**: Long-term tracking of performance across multiple sessions.

---

**Last Updated**: 2026-04-30
**Current Branch**: `dev`
