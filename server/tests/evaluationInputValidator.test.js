import test from "node:test";
import assert from "node:assert/strict";

import { validateEvaluationInput } from "../src/services/evaluationInputValidator.js";

test("accepts valid problem and submission", () => {
    const problem = {
        title: "Parking Lot",
        description: "Design a parking lot system"
    };

    const submission = {
        approach: "Use a ParkingLot manager",
        classes: "ParkingLot, Vehicle, ParkingSpot",
        relationships: "ParkingLot manages parking spots",
    };

    const result = validateEvaluationInput(problem, submission);

    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
});

test("rejects missing problem", () => {
    const submission = {
        approach: "Use classes",
        classes: "ParkingLot",
        relationships: "ParkingLot manages spots"
    };

    const result = validateEvaluationInput(null, submission);

    assert.equal(result.valid, false);
    assert.ok(result.errors.includes("Problem data is missing"));
});

test("rejects missing submission", () => {
    const problem = {
        title: "Parking Lot"
    };

    const result = validateEvaluationInput(problem, null);

    assert.equal(result.valid, false);
    assert.ok(result.errors.includes("Submission data is missing"));
});

test("rejects submission with missing required sections", () => {
    const problem = {
        title: "Parking Lot"
    };

    const submission = {
        approach: "",
        classes: "",
        relationships: ""
    };

    const result = validateEvaluationInput(problem, submission);

    assert.equal(result.valid, false);

    assert.ok(result.errors.includes("Approach is missing"));
    assert.ok(result.errors.includes("Classes are missing"));
    assert.ok(result.errors.includes("Relationships are missing"));
});