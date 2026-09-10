# LLD Practice Platform — Design Note

## 1. MVP Scope

The MVP focuses on a simple learner practice loop:

**Choose Problem → Start Attempt → Submit Design → Receive Feedback → Review → Retry**

The platform supports a small set of LLD problems and uses structured text as the initial submission format.

The goal is to provide useful design feedback while keeping the implementation practical and focused on the core LLD practice experience.

---

## 2. User Flow

1. Learner views available LLD problems.
2. Learner selects a problem.
3. Learner reads the requirements and constraints.
4. Learner starts an attempt.
5. Learner works on a structured LLD solution.
6. Learner can save the solution as a draft.
7. Learner submits the solution.
8. The submission is validated.
9. The submission enters the evaluation process.
10. The learner receives structured feedback.
11. The attempt is stored in history.
12. The learner can review the submission and retry the problem.

---

## 3. Domain Model

The core domain is represented using five main concepts.

### Problem

**Responsibility:**
Represents an LLD practice problem.

Contains:

* Title
* Difficulty
* Description
* Requirements
* Constraints

A Problem is independent of a particular learner attempt.

### Attempt

**Responsibility:**
Represents one practice session for a specific problem and tracks its lifecycle.

Possible states:

```text
DRAFT → SUBMITTED → EVALUATING → COMPLETED
                              ↘
                               FAILED
```

The Attempt owns the practice lifecycle rather than the evaluation implementation.

### Submission

**Responsibility:**
Stores the learner's proposed LLD solution.

The current submission contains:

* Approach
* Classes
* Relationships
* Abstractions
* Patterns
* Assumptions
* Edge cases

The submission format is intentionally separated from the Attempt lifecycle so that other formats can be introduced later.

### Evaluation

**Responsibility:**
Stores the result of evaluating a submission.

An evaluation contains:

* Evaluator type
* Evaluation status
* Criterion scores
* Evidence
* Concerns
* Suggestions
* Confidence
* Overall feedback
* Strengths
* Improvements

### Evaluator

**Responsibility:**
Defines the contract for evaluating a Problem and Submission against the evaluation rubric.

The evaluator abstraction prevents the core practice flow from depending directly on a particular evaluation technology.

The current implementation includes:

```text
Evaluator
   ├── GeminiEvaluator
   └── RuleBasedEvaluator
```

A future human evaluator can be introduced using the same abstraction.

---

## 4. Domain Relationships

The main relationships are:

```text
Problem
   │
   │ 1 : many
   ▼
Attempt
   │
   │ 1 : 1
   ├──────────► Submission
   │
   │ 1 : 1
   └──────────► Evaluation
                    ▲
                    │
                Evaluator
```

Conceptually:

* One Problem can have multiple Attempts.
* One Attempt has one Submission for the current MVP.
* One Attempt has one Evaluation for the current MVP.
* An Evaluation is produced through an Evaluator implementation.

These boundaries keep problem data, learner work, and evaluation results separate.

---

## 5. Evaluation Design

The evaluation process uses both deterministic validation and LLM-based qualitative evaluation.

### Stage 1 — Input Validation

Basic requirements are checked deterministically before calling the LLM.

For example:

* Problem exists.
* Submission exists.
* Approach is provided.
* Classes are provided.
* Relationships are provided.

This prevents obviously incomplete submissions from being sent to the evaluator.

### Stage 2 — LLM Evaluation

The Gemini evaluator evaluates the design using a fixed eight-criterion rubric:

1. Requirement Understanding
2. Class Responsibilities
3. Coupling & Cohesion
4. Encapsulation & Interfaces
5. Abstraction & Patterns
6. Extensibility
7. Edge Cases & Testability
8. Explanation Quality

The evaluator is explicitly instructed to recognize that multiple valid LLD solutions may exist.

It should evaluate the submitted design based on evidence from the learner's solution rather than requiring a single canonical implementation.

### Stage 3 — Response Validation

The LLM response is validated before it is stored.

The application checks:

* Correct number of rubric criteria
* Valid criterion names
* Score range
* Confidence values
* Required response fields

This prevents malformed LLM output from being treated as a successful evaluation.

---

## 6. Explainable Feedback

The evaluation is designed to provide more than a numerical score.

For every rubric criterion, the learner receives:

```text
Criterion
   ↓
Score
   ↓
Evidence
   ↓
Concern
   ↓
Suggestion
   ↓
Confidence
```

This allows the learner to understand:

* What worked in the design
* What could be improved
* Why the evaluator reached the score
* What the learner could change in a future attempt

The system does not assume that a lower score means the learner's entire design is incorrect. Different designs can be valid if their responsibilities, trade-offs, and extensibility are reasonable.

---

## 7. Evaluation State & Failure Handling

Evaluation is represented as an explicit state transition:

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

The submission is persisted before evaluation starts.

This is important because an external LLM call can fail independently of the learner's submission.

If evaluation fails:

* The attempt becomes `FAILED`.
* The evaluation stores the error message.
* The learner's submission remains available.
* Evaluation can be retried.

This prevents an external evaluation failure from causing the learner to lose their work.

---

## 8. Extensibility

### Change A — Submission Format

The current MVP accepts structured text.

Future versions could support:

```text
Structured Text
      │
      ├── Code
      │
      └── Class Diagram
```

The Attempt lifecycle does not need to change because the submission is kept as a separate domain concept.

Only the submission representation and corresponding evaluator/parsing logic would need to be extended.

This keeps the core practice flow independent from the specific submission format.

---

### Change B — Evaluation Method

The practice flow depends on the `Evaluator` abstraction rather than directly depending on Gemini.

Current:

```text
Practice Flow
      │
      ▼
Evaluator
      │
      ▼
GeminiEvaluator
```

Future:

```text
Practice Flow
      │
      ▼
Evaluator
      │
      ├── GeminiEvaluator
      ├── RuleBasedEvaluator
      └── HumanEvaluator
```

This allows the evaluation method to change without rewriting the Attempt or Submission flow.

---

## 9. Architecture

The application uses a modular monolith.

```text
React Client
     │
     │ HTTP API
     ▼
Express Server
     │
     ├── Controllers
     │
     ├── Services
     │
     └── Models
            │
            ▼
         MongoDB

Evaluation Service
     │
     ▼
Evaluator Abstraction
     │
     ├── Gemini
     └── Rule Based
```

The architecture intentionally keeps the application simple because the MVP does not require distributed infrastructure.

---

## 10. Persistence

MongoDB is used to persist:

* Problems
* Attempts
* Submissions
* Evaluations

This allows learners to return to previous attempts and review their feedback.

The separation between these collections/models also keeps the domain responsibilities clear.

---

## 11. Trade-offs

### Modular Monolith

A modular monolith was selected instead of microservices because the current product has a small scope and does not require independent service scaling.

Benefits:

* Easier development
* Easier debugging
* Lower operational complexity
* Clear module boundaries

### Synchronous Evaluation

The MVP performs evaluation as part of the submission flow.

This keeps the prototype simple and easy to understand.

If evaluation becomes slow or the platform needs to handle significant traffic, the evaluation process could later be moved to an asynchronous worker.

### No Kafka or Redis

Kafka and Redis were intentionally not introduced.

They could be useful at larger scale, but adding them to the MVP would increase infrastructure complexity without providing meaningful value for the current number of users and evaluation requests.

---

## 12. Limitations

Current limitations include:

* Limited number of practice problems.
* Structured text is the only submission format.
* LLM evaluation may not always be perfectly consistent.
* No authentication or user accounts.
* Evaluation is currently synchronous.
* No large-scale distributed infrastructure.
* Rule-based evaluation is currently primarily an architectural alternative rather than the main production evaluator.

---

## 13. Future Improvements

Possible future improvements include:

* More LLD problems
* Code-based submissions
* Class diagram submissions
* Human evaluation
* More deterministic LLD checks
* Evaluator calibration using benchmark submissions
* Asynchronous evaluation workers
* User accounts and personalized history
* Attempt comparison
* Learning analytics

These improvements can be introduced incrementally without changing the fundamental learner practice flow.
