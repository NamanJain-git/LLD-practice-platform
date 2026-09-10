import test from "node:test";
import assert from "node:assert/strict";

import { validateEvaluationResponse } from "../src/services/evaluationResponseValidator.js";
import evaluationRubric from "../src/services/rubric.js";

const createValidCriterion = (name) => ({
    name,
    score: 4,
    evidence: "The submission demonstrates a reasonable design.",
    concern: "Some responsibilities could be separated further.",
    suggestion: "Introduce clearer interfaces where appropriate.",
    confidence: "high"
});

const createValidEvaluation = () => ({
    criteria: evaluationRubric.map((criterion) =>
        createValidCriterion(criterion.name)
    ),
    overallFeedback: "Good overall design with room for improvement.",
    strengths: [
        "Clear responsibilities",
        "Reasonable abstractions"
    ],
    improvements: [
        "Improve extensibility",
        "Consider more edge cases"
    ]
});

test("accepts a valid evaluation response", () => {
    const result = validateEvaluationResponse(
        createValidEvaluation(),
        evaluationRubric
    );

    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
});

test("rejects evaluation with incorrect criterion count", () => {
    const evaluation = createValidEvaluation();

    evaluation.criteria.pop();

    const result = validateEvaluationResponse(
        evaluation,
        evaluationRubric
    );

    assert.equal(result.valid, false);
    assert.ok(
        result.errors.some((error) =>
            error.includes("Expected 8 criteria")
        )
    );
});

test("rejects invalid score", () => {
    const evaluation = createValidEvaluation();

    evaluation.criteria[0].score = 7;

    const result = validateEvaluationResponse(
        evaluation,
        evaluationRubric
    );

    assert.equal(result.valid, false);
    assert.ok(
        result.errors.some((error) =>
            error.includes("score must be an integer between 1 and 5")
        )
    );
});

test("rejects invalid confidence value", () => {
    const evaluation = createValidEvaluation();

    evaluation.criteria[0].confidence = "very-high";

    const result = validateEvaluationResponse(
        evaluation,
        evaluationRubric
    );

    assert.equal(result.valid, false);
    assert.ok(
        result.errors.some((error) =>
            error.includes(
                "confidence must be low, medium, or high"
            )
        )
    );
});

test("rejects missing rubric criterion", () => {
    const evaluation = createValidEvaluation();

    evaluation.criteria[0].name = "Invalid Criterion";

    const result = validateEvaluationResponse(
        evaluation,
        evaluationRubric
    );

    assert.equal(result.valid, false);
    assert.ok(
        result.errors.some((error) =>
            error.includes("Missing rubric criterion")
        )
    );
});