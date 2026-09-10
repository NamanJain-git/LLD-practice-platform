# LLD Practice Platform — Research Note

## 1. Problem Understanding

Low-Level Design (LLD) practice is difficult because solving the problem is only one part of the learning process. A learner first needs to understand the requirements, identify the important objects and responsibilities, decide where to start, and choose an appropriate way to represent the design.

While practicing an LLD problem, a learner may have questions such as:

- What are the main requirements of the problem?
- Which classes or objects should be created?
- What responsibilities should each class have?
- Should the solution be represented using code, text, or a class/relationship diagram?
- Which abstractions or design patterns are actually useful?
- How can the design be extended when requirements change?
- Is the solution good if it is different from a reference solution?

The biggest problem is evaluation. Unlike programming problems, LLD problems usually do not have one exact correct solution. Two learners can create different designs and both can be reasonable if their responsibilities, relationships, abstractions, and trade-offs are appropriate.

Existing learning resources can help learners understand LLD concepts and provide example solutions, but learners can still struggle to understand the weaknesses in their own design.

During research, I explored LLD Practice Hub and found its problem-focused practice experience useful as inspiration. The research helped identify an opportunity for a focused platform that combines LLD practice with structured, explainable feedback and attempt history.

The main learner problem identified is:

> Learners can find LLD problems and reference solutions, but they need a better way to practice their own designs and understand specifically what they did well, what could be improved, and how they can improve in their next attempt.

---

## 2. Existing Approaches

### Approach / Tool 1 — LLD Practice Hub

- **How it works:**  
  Provides LLD problems that learners can use for practice. The learner can select a problem and work through the design requirements and solution.

- **Strengths:**  
  - Focused specifically on LLD practice.
  - Provides problem-based learning.
  - Helps learners discover different types of LLD problems.
  - Provides useful inspiration for a focused practice experience.

- **Limitations:**  
  - Practice can still depend heavily on the learner evaluating their own solution.
  - A reference solution does not always explain why another valid design may also work.
  - There is an opportunity for more structured and personalized feedback after submission.

### Approach / Tool 2 — Coding Practice Platforms

- **How it works:**  
  Coding practice platforms provide problems with defined inputs, outputs, constraints, and automated evaluation. Learners submit code and receive a result based on predefined test cases.

- **Strengths:**  
  - Clear practice workflow.
  - Immediate feedback.
  - Learners can repeatedly attempt problems.
  - Automated evaluation works well when there is a clearly defined expected output.

- **Limitations:**  
  - LLD does not usually have one correct output that can be automatically compared.
  - Traditional test-case based evaluation is not sufficient for judging class responsibilities, abstractions, coupling, cohesion, and design trade-offs.
  - The feedback model used for coding problems cannot be directly applied to LLD.

### Approach / Tool 3 — Reference Solutions and Learning Resources

- **How it works:**  
  Learners study articles, tutorials, GitHub repositories, videos, or reference implementations to understand how experienced developers approach LLD problems.

- **Strengths:**  
  - Provides detailed explanations and examples.
  - Helps learners understand design patterns and common approaches.
  - Useful for learning after attempting a problem.

- **Limitations:**  
  - The learner generally has to compare their own solution manually with the reference.
  - A different design can appear incorrect even when it is valid.
  - Feedback is usually not personalized to the learner's specific attempt.
  - It does not always support a structured practice → feedback → retry learning loop.

---

## 3. Observed Gaps

Based on the research, the following gaps were identified:

- Learners need guidance from understanding requirements to structuring their own LLD solution.
- LLD cannot always be evaluated using a single reference solution because multiple designs can be valid.
- A single overall score is not enough; learners need feedback explaining the evidence behind the evaluation.
- Feedback should focus on important LLD dimensions such as responsibilities, abstraction, coupling, cohesion, extensibility, and edge cases.
- Learners should be able to review previous attempts and identify whether their design improves over time.
- Different evaluation approaches may be useful in the future, such as rule-based evaluation, AI evaluation, or human review.
- The platform should keep the practice experience focused instead of becoming a complete LMS or large assessment system.

---

## 4. Product Direction

The proposed product is a focused LLD practice platform built around the following learning loop:

**Choose Problem → Understand → Design → Submit → Get Feedback → Review → Try Again**

The platform will provide a small collection of LLD problems through problem cards. When a learner opens a problem, they will see the problem description, requirements, constraints, and other context needed to attempt the design.

The learner will then start an attempt and provide their solution using a structured text-based format. The MVP will focus on capturing useful design information such as:

- Overall approach
- Classes and responsibilities
- Relationships between classes
- Abstractions or interfaces
- Design patterns, if applicable
- Assumptions
- Edge cases

After submission, the platform will evaluate the solution using a fixed rubric. Deterministic checks will handle basic submission validation, while an LLM can be used for judgment-heavy areas such as responsibility assignment, abstraction quality, extensibility, and design trade-offs.

Instead of returning only a score, the platform will provide structured feedback containing:

- Criterion score
- Evidence from the learner's submission
- Concerns
- Suggestions for improvement
- Confidence

The platform will also store previous attempts so that learners can review their progress and retry the same problem.

The MVP will use a simple modular architecture rather than introducing unnecessary distributed-system infrastructure.

---

## 5. MVP Scope

### Included

The MVP will include:

- A small set of 3–5 LLD problems.
- Problem cards with difficulty and basic information.
- Detailed problem requirements and context.
- Ability to start an attempt.
- Structured text-based solution submission.
- Submission status tracking.
- Basic deterministic submission validation.
- Rubric-based evaluation.
- LLM-assisted qualitative feedback.
- Structured evaluation results.
- Attempt history.
- Ability to retry a problem.
- Handling for evaluation failure.
- Tests for important behavior and edge cases.
- Documentation explaining the architecture and design decisions.

### Submission Format

The MVP will use structured text rather than supporting multiple submission formats.

This keeps the implementation focused while still providing enough information to evaluate important LLD concepts.

Future versions could support:

- Code submissions
- Class diagrams
- UML diagrams
- Combined text and diagram submissions

### Evaluation

The MVP will use a combination of:

**Deterministic evaluation**
- Required fields
- Submission structure
- Submission state
- Basic validation

**LLM-based evaluation**
- Requirement understanding
- Responsibility assignment
- Abstraction and encapsulation
- Coupling and cohesion
- Extensibility
- Edge cases and testability
- Improvement suggestions

The evaluation design will avoid treating a single reference solution as the only correct answer.

### Not Included

The MVP will not attempt to build:

- A complete LMS
- User management and complex authentication
- Leaderboards
- Social features
- Real-time collaboration
- A full UML/diagram editor
- A code execution environment
- Microservices
- Kubernetes infrastructure
- Multi-region architecture
- Kafka-based distributed processing
- Complex Redis infrastructure
- Large-scale analytics

These features can be considered in future versions if the core practice loop proves useful.