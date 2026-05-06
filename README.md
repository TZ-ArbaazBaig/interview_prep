# 🧠 InterviewPrep AI

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Groq](https://img.shields.io/badge/Groq_AI-f55036?style=for-the-badge)](https://groq.com/)

**InterviewPrep AI** is a production-quality full-stack platform designed to help candidates ace their next technical interview. By leveraging **Llama 3** via the Groq API and **RAG (Retrieval-Augmented Generation)** with Pinecone, it generates hyper-tailored questions based on specific job descriptions and provides instant, expert-level feedback on user responses.

---

## ✨ Key Features

- **🎯 RAG-Powered Precision**: Advanced context retrieval using Pinecone to ensure questions are perfectly aligned with the provided Job Description.
- **🛡️ Secure Authentication**: Full user lifecycle management (Sign In/Sign Up/Profile) powered by **Clerk**.
- **📊 Real-time AI Evaluation**: Instant scoring (1-10) and constructive feedback on every answer using Llama-3.3-70b.
- **🏆 Intelligent Dashboard**: Track your performance across multiple sessions with persistent data stored in **MongoDB**.
- **🔄 Smart Session Persistence**: Never lose your progress—interviews are saved and can be resumed at any time.
- **💎 Premium UI/UX**: A sleek, Obsidian-inspired design with fluid animations using Framer Motion.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Client**: Axios

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Vector Store**: Pinecone (for RAG)
- **AI Engine**: Groq SDK (Llama-3.3-70b-versatile)
- **Embeddings**: @xenova/transformers (local embedding generation)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v20 or higher)
- MongoDB Atlas account (or local MongoDB)
- Groq API Key
- Pinecone API Key
- Clerk Account (Publishable & Secret Keys)

### 2. Installation
Clone the repository and install dependencies:

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 3. Environment Setup

Create a `.env` file in the `/server` directory:
```env
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=your_mongodb_uri
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index
CLERK_SECRET_KEY=your_clerk_secret_key
PORT=3005
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `/client` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
VITE_API_URL=http://localhost:3005
```

### 4. Run the App
Start the backend and frontend in separate terminals:

**Server:**
```bash
cd server
npm run dev
```

**Client:**
```bash
cd client
npm run dev
```

---

## 📂 Project Structure

```text
interview-prep-ai/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components (Auth, Layout, UI)
│   │   ├── pages/         # Page layouts (Home, Dashboard, Interview)
│   │   ├── hooks/         # Custom API hooks
│   │   └── utils/         # Axios & Clerk config
├── server/                # Express backend
│   ├── routes/            # API endpoints (Auth, Sessions, Questions)
│   ├── services/          # Business logic (Groq, Pinecone, RAG)
│   ├── models/            # Mongoose Schemas (User, Session, Question)
│   ├── db/                # MongoDB connection setup
│   └── middleware/        # Auth (Clerk) & Error handling
```

---

## 🤝 Contributing
Feel free to fork this project, open issues, or submit PRs to improve the preparation experience!

## 📄 License
MIT © 2026 Arbaaz Baig