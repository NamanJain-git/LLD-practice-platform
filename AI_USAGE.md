# AI Usage

## Overview

AI tools were used selectively during the development of the LLD Practice Platform as a development assistant for research, brainstorming, debugging, and reviewing implementation decisions.

The core application was designed and implemented by me. I used AI to accelerate parts of the development process, validate decisions, and explore alternative approaches. I reviewed and adapted AI suggestions rather than directly relying on generated solutions.

The final architecture, implementation choices, scope, and trade-offs were decided based on the assignment requirements and my own understanding of the project.

---

## 1. Evaluation Rubric Design

### Context

The platform needed to provide useful feedback for LLD solutions, while recognizing that multiple valid designs can exist.

### AI assistance

AI was used to brainstorm possible dimensions for evaluating an LLD solution and to compare different rubric structures.

### What AI suggested

Possible evaluation areas included:

* Requirement understanding
* Class responsibilities
* Coupling and cohesion
* Encapsulation
* Abstraction
* Design patterns
* Extensibility
* Edge cases
* Explanation quality

### My decision

I consolidated these ideas into an 8-criterion rubric:

1. Requirement Understanding
2. Class Responsibilities
3. Coupling & Cohesion
4. Encapsulation & Interfaces
5. Abstraction & Patterns
6. Extensibility
7. Edge Cases & Testability
8. Explanation Quality

### Why

I wanted the rubric to focus on practical LLD skills rather than simply checking whether a learner used a particular design pattern or matched a predefined solution.

The rubric therefore evaluates the quality and reasoning of a design instead of assuming there is only one correct implementation.

---

## 2. Evaluator Abstraction

### Context

The assignment requires considering how the system could support different evaluation approaches in the future.

### AI assistance

AI was used to discuss possible evaluator architectures and the trade-offs between tightly coupling the application to an LLM and introducing an evaluator abstraction.

### What AI suggested

A common evaluator interface could allow different evaluation implementations to be swapped without changing the practice flow.

### My decision

I implemented an `Evaluator` abstraction with separate evaluator implementations.

```text
Evaluator
   │
   ├── GeminiEvaluator
   │
   └── RuleBasedEvaluator
```

The practice flow depends on the evaluator abstraction rather than directly depending on Gemini.

### Why

This directly addresses the assignment's future-change requirement:

> LLM evaluator → rule-based/human evaluator without rewriting the practice flow.

It also keeps the evaluation logic isolated from the core attempt and submission workflow.

---

## 3. Structured LLM Evaluation

### Context

LLM responses can be inconsistent, while the application needs predictable data to display and persist evaluation results.

### My decision

I implemented Gemini evaluation using a structured JSON response and added a separate response validator.

The expected structure contains:

```text
criteria
overallFeedback
strengths
improvements
```

Each criterion contains:

```text
name
score
evidence
concern
suggestion
confidence
```

### Why

I did not want raw LLM text to be directly stored as an evaluation.

The response is validated before it is persisted so that malformed or incomplete LLM output does not become a successful evaluation.

---

## 4. Deterministic Validation + LLM Evaluation

### Context

The assignment asks for consideration of deterministic evaluation alongside LLM evaluation.

### AI assistance

AI was used to discuss which checks should be deterministic and which aspects are better suited to qualitative LLM evaluation.

### My decision

I separated the process into two stages.

```text
Submission
    │
    ▼
Deterministic Input Validation
    │
    ▼
LLM Qualitative Evaluation
    │
    ▼
Response Validation
    │
    ▼
Persist Evaluation
```

Deterministic validation handles basic requirements such as:

* Problem data exists
* Submission exists
* Approach is provided
* Classes are provided
* Relationships are provided
* LLM response contains the expected rubric criteria
* Scores are within the allowed range
* Confidence values are valid

The LLM handles qualitative areas such as:

* Design quality
* Responsibilities
* Coupling
* Abstraction
* Extensibility
* Reasoning quality
* Improvement suggestions

### Why

Deterministic checks provide predictable validation, while the LLM is used where interpretation and design reasoning are required.

This avoids expecting the LLM to perform simple validation that can be handled reliably by application code.

---

## 5. Evaluation Failure Handling

### Context

LLM calls can fail because of API errors, malformed responses, network problems, or other runtime issues.

The assignment also requires the system to consider slow or failed evaluation.

### My decision

I implemented explicit evaluation and attempt states:

```text
DRAFT
  ↓
SUBMITTED
  ↓
EVALUATING
  ↓
COMPLETED
```

If evaluation fails:

```text
EVALUATING
  ↓
FAILED
```

The submission is persisted before the evaluation begins.

When evaluation fails, the error is stored and the attempt can be retried.

### Why

The learner should not lose their work simply because an external evaluator fails.

I also chose not to introduce queues, Kafka, or microservices for the MVP because the assignment explicitly favors a practical solution without distributed-systems overengineering.

---

## AI-Assisted Coding

AI was also used during development as a programming assistant for selected tasks, including:

* Debugging implementation issues
* Reviewing API and data-flow logic
* Suggesting validation cases
* Reviewing error handling
* Helping investigate dependency/runtime errors
* Improving documentation structure
* Reviewing implementation against the assignment requirements

However, the application was not generated as a complete AI-produced project.

I implemented and integrated the application myself, including the frontend, backend, API routes, evaluation flow, Gemini integration, UI, and testing. AI suggestions were reviewed, modified, and tested before being incorporated.

---

## What I Did Not Delegate to AI

The following decisions remained my responsibility:

* Final project scope
* Technology selection
* Overall application architecture
* MongoDB data model
* Frontend page and user flow implementation
* Gemini API integration
* Evaluator integration
* Error and state handling
* Testing strategy
* UI implementation
* Final engineering trade-offs
* Final code review and debugging

AI suggestions were treated as recommendations rather than authoritative solutions.

---

## Key Principle

The main principle followed during development was:

> **Use AI to accelerate engineering work, not to replace engineering judgment.**

AI helped me explore alternatives and solve problems faster, but I made the final decisions based on the assignment requirements, implementation constraints, and behavior of the actual application.