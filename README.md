# LLD Practice Platform

A full-stack practice platform that helps learners practice Low-Level Design (LLD) problems and receive structured, explainable feedback on their solutions.

The platform follows a simple learning loop:

**Choose Problem → Design Solution → Submit → Get Feedback → Review → Retry**

---

## Features

* Practice curated LLD problems
* View problem requirements and constraints
* Create and continue practice attempts
* Save solutions as drafts
* Submit structured LLD solutions
* AI-powered evaluation using Google Gemini
* 8-criterion LLD evaluation rubric
* Evidence-based feedback
* Scores from 1–5 for each criterion
* Strengths and improvement suggestions
* Confidence level for each evaluation criterion
* Evaluation status tracking
* Failed evaluation handling
* Previous attempt history
* Retry and practice again
* Modular evaluator architecture for future rule-based or human evaluation

---

## Tech Stack

### Frontend

* React.js
* Vite
* React Router
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### AI

* Google Gemini API
* `@google/genai`

### Testing

* Node.js built-in test runner

---

## Project Architecture

The project follows a simple **modular monolith architecture**.

```text
lld-practice-platform/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── tests/
│   └── ...
│
├── docs/
│   ├── RESEARCH.md
│   └── DESIGN.md
│
├── AI_USAGE.md
└── README.md
```

---

## Domain Model

The core practice flow is represented using the following domain entities:

```text
Problem
   │
   ▼
Attempt
   │
   ▼
Submission
   │
   ▼
Evaluation
```

### Problem

Represents an LLD practice problem.

Contains:

* Title
* Difficulty
* Description
* Requirements
* Constraints

### Attempt

Represents a learner's practice session for a problem.

Possible states:

```text
DRAFT
SUBMITTED
EVALUATING
COMPLETED
FAILED
```

### Submission

Stores the learner's LLD solution, including:

* Approach
* Classes
* Relationships
* Abstractions
* Patterns
* Assumptions
* Edge cases

### Evaluation

Stores structured feedback produced by an evaluator.

Each criterion contains:

```text
Criterion
Score
Evidence
Concern
Suggestion
Confidence
```

---

## Evaluation Approach

The platform uses a combination of deterministic validation and LLM-based qualitative evaluation.

### Step 1 — Input Validation

Before evaluation, the system checks whether the required submission sections are present.

Required sections:

* Approach
* Classes
* Relationships

### Step 2 — LLM Evaluation

A Gemini-based evaluator analyzes the learner's solution against the predefined rubric.

The evaluator is instructed to:

* Consider multiple valid LLD approaches
* Avoid assuming one canonical solution
* Use evidence from the submitted solution
* Avoid inventing unsupported claims
* Provide constructive feedback
* Return structured JSON

### Step 3 — Response Validation

The generated response is validated before being persisted.

The validator checks:

* Exactly 8 rubric criteria
* Valid criterion names
* Score between 1 and 5
* Valid confidence values
* Required text fields
* Strengths and improvements arrays

Invalid LLM output is not treated as a successful evaluation.

---

## Evaluation Rubric

The platform evaluates submissions using eight criteria:

1. Requirement Understanding
2. Class Responsibilities
3. Coupling & Cohesion
4. Encapsulation & Interfaces
5. Abstraction & Patterns
6. Extensibility
7. Edge Cases & Testability
8. Explanation Quality

Each criterion receives a score from **1 to 5** along with evidence, concerns, suggestions, and confidence.

---

## Evaluator Architecture

The evaluator is abstracted behind a common interface:

```text
Evaluator
   │
   ├── GeminiEvaluator
   │
   └── RuleBasedEvaluator
```

This keeps the practice flow independent from the evaluation implementation.

For example, a future human evaluator could be added without rewriting the practice flow.

```text
Practice Flow
      │
      ▼
Evaluator Interface
      │
 ┌────┼─────────┐
 ▼    ▼         ▼
LLM  Rules    Human
```

---

## Evaluation State Handling

Evaluation is treated as a stateful process:

```text
SUBMITTED
    │
    ▼
EVALUATING
    │
    ├──────────────► COMPLETED
    │
    └──────────────► FAILED
```

The submission is persisted before evaluation begins.

If the evaluator fails, the attempt is marked as `FAILED` and the error is stored with the evaluation record.

This allows the user to retry evaluation without losing their submission.

---

## API Endpoints

### Problems

```text
GET /api/problems
GET /api/problems/:id
```

### Attempts

```text
POST /api/attempts
GET /api/attempts
GET /api/attempts/:id
PUT /api/attempts/:id
POST /api/attempts/:id/submit
POST /api/attempts/:id/evaluate
```

---

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* MongoDB

A Google Gemini API key is also required for AI evaluation.

---

## Backend Setup

Navigate to the server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lld-practice-platform
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5000
```

---

## Seed Problems

To populate the database with the sample LLD problems:

```bash
npm run seed
```

The current prototype includes:

* Parking Lot
* Vending Machine
* Elevator System

---

## Frontend Setup

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the local URL shown by Vite in the terminal.

---

## Testing

Backend tests use Node.js's built-in test runner.

From the `server` directory:

```bash
npm test
```

The tests currently cover:

* Valid evaluation input
* Missing problem data
* Missing submission data
* Missing required submission sections
* Valid LLM evaluation response
* Incorrect rubric criterion count
* Invalid score
* Invalid confidence value
* Missing rubric criterion

---

## AI Usage

AI was used during development for selected engineering decisions, research, implementation assistance, and evaluation design.

Meaningful AI-assisted decisions are documented separately in:

```text
AI_USAGE.md
```

The document explains what AI suggested, what was accepted or rejected, and the reasoning behind those decisions.

---

## Design Documentation

Additional design documentation is available in:

```text
docs/RESEARCH.md
docs/DESIGN.md
```

`RESEARCH.md` covers the problem understanding, existing approaches, product direction, MVP scope, and future possibilities.

`DESIGN.md` explains the architecture, domain model, evaluation strategy, extensibility, failure handling, and engineering trade-offs.

---

## Scope & Engineering Trade-offs

This prototype intentionally uses a simple modular monolith.

The assignment focuses primarily on:

* LLD practice
* Domain modeling
* Explainable evaluation
* Extensible evaluator design
* Reliable evaluation handling
* Practical product experience

The following were intentionally excluded from the MVP:

* Authentication
* Leaderboards
* Social features
* Complex UML editing
* Code execution sandbox
* Microservices
* Kubernetes
* Multi-region infrastructure
* Sharding
* Distributed event pipelines
* Complex caching infrastructure

These could be considered if the product grows beyond the MVP.

---

## Future Improvements

Potential future extensions include:

* Code-based submissions
* Class diagram submissions
* Diagram-to-domain parsing
* Human evaluation
* More deterministic LLD checks
* Additional LLD problems
* User accounts and personalized history
* More detailed learning analytics
* Improved evaluator calibration
* Retry and comparison between multiple attempts

The current domain model is designed so that these additions can be introduced without rewriting the core practice flow.

---

## Current MVP Flow

```text
Home
  │
  ▼
Choose LLD Problem
  │
  ▼
Start Attempt
  │
  ▼
Practice
  │
  ├── Save Draft
  │
  ▼
Submit
  │
  ▼
Evaluate
  │
  ├── Gemini
  │
  ▼
Structured Feedback
  │
  ▼
Review
  │
  ├── View Submission
  ├── Practice Again
  └── History
```

---

## Author

**Naman Jain**

Frontend / React.js Developer

Built as an engineering assignment demonstrating React, Node.js, MongoDB, LLD/domain modeling, AI evaluation, and reliable application design.
