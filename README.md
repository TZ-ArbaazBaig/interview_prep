# InterviewPrep AI 🧠

A production-quality full-stack application that helps candidates prepare for interviews using AI. Paste any job description, and the AI will generate 10 tailored interview questions and evaluate your answers with detailed feedback.

## Features

- **🎯 JD-Specific Questions**: AI analyzes the job description to generate relevant technical, behavioral, and system design questions.
- **💬 Mock Interview Mode**: Practice answering questions in a focused environment.
- **🤖 AI Evaluation**: Get instant scores (1-10) and constructive feedback on your answers.
- **📚 Model Answers**: See how a senior professional would answer each question.
- **⏳ History**: Keep track of all your past preparation sessions.

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: SQLite (better-sqlite3)
- **AI**: Groq API (llama-3.3-70b-versatile)

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- Groq API Key (get one at [console.groq.com](https://console.groq.com))

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Add your GROQ_API_KEY to .env
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Environment Variables

### Server (`/server/.env`)
- `GROQ_API_KEY`: Your Groq API key
- `PORT`: 3001
- `NODE_ENV`: development
- `CLIENT_URL`: http://localhost:5173

### Client (`/client/.env`)
- `VITE_API_URL`: http://localhost:3001/api

## License
MIT
