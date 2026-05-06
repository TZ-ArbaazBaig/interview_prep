# 📑 InterviewPrep AI - Project Overview

## 🎯 Goal
A production-ready full-stack application that provides AI-generated interview preparation tailored to specific job descriptions, using RAG for deep context awareness and Clerk for secure multi-user support.

---

## 🏗️ Technical Architecture

### 🛡️ Core Technologies
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Vector Search**: Pinecone (Retrieval-Augmented Generation)
- **Authentication**: Clerk (Identity-as-a-Service)
- **AI**: Groq API (Llama-3.3-70b-versatile)
- **Embeddings**: @xenova/transformers (local embedding generation)

### 📂 Directory Structure
```text
interview-prep-ai/
├── client/                # React App
│   ├── src/
│   │   ├── components/    # UI Building Blocks (Auth, Layout, UI)
│   │   ├── pages/         # View Templates (Home, Dashboard, Interview)
│   │   ├── hooks/         # API & Logic abstractions
│   │   └── utils/         # Configs (Axios, Clerk)
├── server/                # Express API
│   ├── routes/            # API Endpoints
│   ├── services/          # Business logic (Groq, Pinecone, RAG)
│   ├── models/            # Mongoose Models (User, Session, Question, Evaluation)
│   ├── db/                # MongoDB initialization
│   └── middleware/        # Global error handling & Clerk Auth
```

---

## 🚀 Implemented Features

### 1. RAG-Enabled Intelligence Engine
- **Vector Search**: Uses Pinecone to retrieve relevant context from Job Descriptions for hyper-specific question generation.
- **Local Embeddings**: Generates embeddings locally using `@xenova/transformers` to optimize cost and performance.
- **JD Parsing**: Extracts role requirements from pasted text.

### 2. Multi-User Authentication
- **Clerk Integration**: Secure Sign-in/Sign-up with customized UI.
- **User Persistence**: Syncs Clerk user data with MongoDB profiles.
- **Protected Routes**: Ensures only authenticated users can access interview sessions.

### 3. Interview System
- **Dynamic Questions**: Balances Technical, Behavioral, and System Design questions (3/4/3 split).
- **Progress Tracking**: Real-time progress bar and auto-resume capability.
- **Interactive Mock**: A focused practice environment with instant feedback.

### 4. AI Evaluation & Analytics
- **Instant Scoring**: 1-10 scoring with detailed feedback for every answer.
- **Model Answers**: Provides a high-quality example answer for every question.
- **Performance Summary**: A dedicated dashboard showing average score and breakdown across all user sessions.

---

## 🛠️ Environment Configuration
The project uses `.env` files for security:
- `GROQ_API_KEY`: Required for all AI operations.
- `MONGODB_URI`: Primary database for user data and session history.
- `PINECONE_API_KEY`: Used for vector store operations.
- `CLERK_SECRET_KEY`: Backend secret for authentication validation.

---

## 🗺️ Roadmap & Future Plans
- [x] **Clerk Auth**: Completed secure user lifecycle management.
- [x] **MongoDB Migration**: Completed transition from SQLite for cloud-ready persistence.
- [x] **RAG Implementation**: Completed context-aware question generation using Pinecone.
- [ ] **UI Overhaul**: Finalize "Obsidian/Violet" premium aesthetic.
- [ ] **Audio/Video Mock**: Integration of speech-to-text for more realistic practice.
- [ ] **Resume Upload**: Allow users to upload PDFs instead of pasting text.
- [ ] **Analytics**: Long-term tracking of performance trends.

---

**Last Updated**: 2026-05-05
**Current Branch**: `main`
