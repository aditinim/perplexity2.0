# Phoenix — AI Research Assistant

Phoenix is an AI-powered research assistant inspired by modern AI search engines. It combines Large Language Models (LLMs), real-time web search, and Retrieval-Augmented Generation (RAG) to provide intelligent and context-aware responses.

The application allows users to interact with AI, retrieve real-time information from the internet, upload PDF documents, and ask questions based on their uploaded content.

pdf: https://drive.google.com/file/d/1gtzuLFy0cvqcOAMX72fcmBS_YIpxzQkS/view?usp=sharing

---

## Overview

Phoenix is built to provide a research-oriented AI experience by combining conversational AI with external knowledge sources.

The system integrates:

- AI-powered conversations
- Real-time internet search
- Document-based question answering
- Semantic search using vector databases
- Persistent chat history
- Secure user authentication

---

# Features

## AI Chat Assistant

- Conversational AI powered by Large Language Models
- Context-aware responses
- Persistent chat conversations
- Real-time streamed responses
- AI agent-based workflow for handling multiple information sources

---

## Real-Time Web Search

- Retrieves latest information from the internet
- Integrated with Tavily Search API
- Uses AI agents for intelligent tool calling
- Converts search results into meaningful user responses

---

## PDF Intelligence using RAG

Phoenix implements a Retrieval-Augmented Generation pipeline for document understanding.

Users can:

- Upload PDF documents
- Extract text from documents
- Split documents into smaller chunks
- Generate embeddings using Mistral AI
- Store embeddings in Pinecone Vector Database
- Retrieve relevant information using semantic search
- Ask questions directly from uploaded documents

---

## Authentication System

- User registration and login
- JWT-based authentication
- HTTP-only cookie sessions
- Email verification workflow
- Protected API routes

---

## Real-Time Communication

- Socket.IO based communication
- Token-by-token AI response streaming
- Real-time chat experience

---

# System Architecture

```
                         User
                           |
                           |
                    React Frontend
                           |
                           |
                    Express Backend
                           |
        +------------------+------------------+
        |                  |                  |
 Authentication       AI Agent          PDF Upload
        |                  |                  |
     MongoDB          LangChain        PDF Processing
                           |                  |
                           |             Text Chunking
                           |                  |
                           |          Mistral Embeddings
                           |                  |
                           |          Pinecone Vector DB
                           |
                    LLM Processing
                           |
                           |
                    Final Response
```

---

# Retrieval-Augmented Generation Pipeline

Phoenix uses RAG to answer questions from uploaded documents.

```
PDF Upload
     |
     ↓
Text Extraction
     |
     ↓
Document Chunking
     |
     ↓
Generate Embeddings
     |
     ↓
Store Vectors in Pinecone
     |
     ↓
User Query
     |
     ↓
Semantic Similarity Search
     |
     ↓
Retrieve Relevant Context
     |
     ↓
LLM Generates Answer
```

---

# AI Workflow

Phoenix uses an AI agent architecture where the model decides when to use external tools.

```
User Query
     |
     ↓
LangChain Agent
     |
     +----------------+
     |                |
     ↓                ↓
Tavily Search     Pinecone Retriever
     |                |
     +----------------+
              |
              ↓
       Context Generation
              |
              ↓
          LLM Response
              |
              ↓
          User Answer
```

---

# Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- Socket.IO Client

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO

## AI and RAG

- LangChain
- Mistral AI
- Google Gemini API
- Pinecone Vector Database
- Tavily Search API

## Tools

- Git
- GitHub
- Postman
- VS Code

---

# Project Structure

```
Phoenix
|
├── Backend
|   |
|   ├── controllers
|   ├── models
|   ├── routes
|   ├── middleware
|   |
|   ├── services
|   |   ├── ai.service.js
|   |   ├── pdf.service.js
|   |   ├── pinecone.service.js
|   |   ├── retriever.service.js
|   |   └── internet.service.js
|   |
|   └── server.js
|
├── Frontend
|   |
|   └── src
|       |
|       ├── features
|       ├── components
|       ├── hooks
|       └── services
|
└── README.md
```

---

# Installation and Setup

## Clone Repository

```bash
git clone https://github.com/your-username/phoenix.git

cd phoenix
```

---

# Backend Setup

Navigate to backend:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_USER=your_email

GEMINI_API_KEY=your_api_key
MISTRAL_API_KEY=your_api_key

TAVILY_API_KEY=your_api_key

PINECONE_API_KEY=your_api_key
PINECONE_INDEX_NAME=your_index_name

FRONTEND_URL=http://localhost:5173
```

Start backend:

```bash
npm run dev
```

---

# Frontend Setup

Navigate to frontend:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Create `.env`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Start frontend:

```bash
npm run dev
```

---

# API Endpoints

## Authentication

```
POST   /api/auth/register

POST   /api/auth/login

GET    /api/auth/get-me

GET    /api/auth/verify-email
```

---

## Chat

```
POST   /api/chats/create

POST   /api/chats/message
```

---

## PDF Upload

```
POST   /api/upload
```

Workflow:

```
Upload PDF
     |
Extract Text
     |
Create Chunks
     |
Generate Embeddings
     |
Store in Pinecone
     |
Attach Document to Chat
```

---

# Security

Phoenix implements:

- JWT authentication
- HTTP-only cookies
- Protected routes
- Environment variable based secrets
- User-specific document access

---

# Future Improvements

- Multi-model AI selection
- Improved conversation memory
- Better citation system
- Image and table understanding from PDFs
- Voice-based interaction
- Advanced document analytics
- Cloud deployment
- User feedback-based response improvement

---

# Author

Aditi Nim

B.Tech Computer Science  
KIET Group of Institutions
