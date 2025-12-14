# Falcon University - Admission Pre-Assessment Tool

An AI-powered web application that simulates an admission officer, guiding applicants through a chat-based eligibility check using LLM and RAG (Retrieval-Augmented Generation).

## 🎯 Overview

This tool allows:
- **Admins** to upload eligibility requirements (PDF) and view applicant results
- **Students** to complete an interactive interview with an AI assistant
- **AI** to evaluate eligibility based on uploaded requirements

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Native Driver) |
| LLM | Groq (Llama 3.3 70B) |
| RAG | LangChain |
| PDF Parsing | unpdf |

## 📁 Project Structure

```
├── falcon-backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Error handling, validation
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic, LLM integration
│   │   └── app.js
│   ├── server.js
│   └── .env
│
├── falcon-frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   └── services/       # API calls
│   └── package.json
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or cloud)
- Groq API Key ([Get free key](https://console.groq.com))

### Backend Setup

```bash
# Navigate to backend
cd falcon-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your credentials to .env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/falcon_university
GROQ_API_KEY=your_groq_api_key_here

# Start server
node server.js
```

### Frontend Setup

```bash
# Navigate to frontend
cd falcon-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Application

- **Admin Dashboard:** http://localhost:3001
- **Backend API:** http://localhost:3000

## 📖 How to Use

1. **Upload PDF** - Admin uploads a PDF containing eligibility requirements
2. **Start Interview** - Click "Start Interview" to open chat interface
3. **Complete Interview** - AI asks questions based on PDF requirements
4. **View Results** - Admin sees applicant results with transcripts

## 🔌 API Endpoints

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/upload` | Upload requirements PDF |
| GET | `/api/admin/knowledgebase` | Check PDF status |
| GET | `/api/admin/applicants` | Get all applicants |
| GET | `/api/admin/applicants/:id` | Get single applicant |

### Interview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interview/start` | Start new interview |
| POST | `/api/interview/message` | Send message |
| POST | `/api/interview/end` | End interview early |

## 🤖 LLM & RAG Implementation

The application uses **RAG (Retrieval-Augmented Generation)** to make the AI context-aware:

1. Admin uploads PDF with eligibility requirements
2. PDF text is extracted and stored as knowledgebase
3. When student chats, the knowledgebase is passed to the LLM
4. LLM asks questions and evaluates based **only** on the PDF content
5. Different PDF = Different questions and criteria

This means the system is **flexible** - change the PDF, and the interview adapts automatically.

---

## 💭 Product Thinking Assessment

### 1. Stakeholder Alignment

**Key Stakeholders:**

- **Admissions Office** - Primary users who need efficient screening
- **University Leadership** - Want cost savings and consistent evaluations
- **IT Department** - Responsible for system maintenance and security
- **Prospective Students** - Need fair, transparent, and accessible process
- **Compliance/Legal Team** - Ensure fair admissions practices

**Ensuring Needs in Product Roadmap:**

- Conduct regular stakeholder interviews to gather requirements
- Create feedback loops (surveys, usage analytics) post-launch
- Prioritize features using impact vs effort matrix with stakeholder input
- Hold quarterly roadmap reviews with representatives from each group
- Maintain transparent communication about trade-offs and timelines

### 2. Success Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **Completion Rate** | % of students who finish the interview | > 85% |
| **Accuracy Rate** | % of eligibility decisions matching manual review | > 95% |
| **Time to Decision** | Average time from start to eligibility result | < 10 minutes |

**Additional Metrics to Consider:**
- User satisfaction score (NPS)
- Admin time saved per application
- System uptime and response time

### 3. Risk Awareness

**Major Risk: AI Bias and Incorrect Eligibility Decisions**

The AI might make mistakes or exhibit bias that could unfairly reject qualified students or accept unqualified ones, leading to legal issues and reputational damage.

**Mitigation Strategies:**

1. **Human Review Layer** - Flag edge cases for manual review by admissions staff
2. **Audit Trail** - Store complete transcripts for every decision 
3. **Regular Accuracy Audits** - Compare AI decisions with manual reviews periodically
4. **Clear Disclaimers** - Inform students this is a pre-assessment, not final decision
5. **Bias Testing** - Test system with diverse applicant profiles before deployment
6. **Appeal Process** - Allow students to request human review if they disagree

---

## 🎥 Demo Video

[[Loom Video Link](https://www.loom.com/share/df77c9838cfe470eb6b3ad0d40ccf83d)]


## Deployed Link

[[Deployed Link](https://interview-system-0p0l.onrender.com/)]


## 📄 License

This project was created as part of a technical assessment for Lotus AI.