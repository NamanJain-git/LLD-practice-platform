const validConfidenceValues = ["low", "medium", "high"];

export const validateEvaluationResponse = (result, rubric) => {
    const errors = [];

    if (!result || typeof result !== "object") {
        return {
            valid: false,
            errors: ["Evaluation response must be an object"]
        };
    }

    if (!Array.isArray(result.criteria)) {
        errors.push("Criteria must be an array");
    }

    if (result.criteria?.length !== rubric.length) {
        errors.push(
            `Expected ${rubric.length} criteria, received ${result.criteria?.length || 0}`
        );
    }

    if (typeof result.overallFeedback !== "string") {
        errors.push("overallFeedback must be a string");
    }

    if (!Array.isArray(result.strengths)) {
        errors.push("strengths must be an array");
    }

    if (!Array.isArray(result.improvements)) {
        errors.push("improvements must be an array");
    }

    if (Array.isArray(result.criteria)) {
        result.criteria.forEach((criterion, index) => {
            if (!criterion || typeof criterion !== "object") {
                errors.push(`Criterion ${index + 1} must be an object`);
                return;
            }

            if (!criterion.name) {
                errors.push(`Criterion ${index + 1}: name is missing`);
            }

            if (
                typeof criterion.score !== "number" ||
                criterion.score < 1 ||
                criterion.score > 5 ||
                !Number.isInteger(criterion.score)
            ) {
                errors.push(
                    `Criterion ${index + 1}: score must be an integer between 1 and 5`
                );
            }

            if (typeof criterion.evidence !== "string") {
                errors.push(
                    `Criterion ${index + 1}: evidence must be a string`
                );
            }

            if (typeof criterion.concern !== "string") {
                errors.push(
                    `Criterion ${index + 1}: concern must be a string`
                );
            }

            if (typeof criterion.suggestion !== "string") {
                errors.push(
                    `Criterion ${index + 1}: suggestion must be a string`
                );
            }

            if (!validConfidenceValues.includes(criterion.confidence)) {
                errors.push(
                    `Criterion ${index + 1}: confidence must be low, medium, or high`
                );
            }
        });
    }

    const rubricNames = rubric.map((criterion) => criterion.name);

    if (Array.isArray(result.criteria)) {
        const returnedNames = result.criteria.map(
            (criterion) => criterion.name
        );

        rubricNames.forEach((name) => {
            if (!returnedNames.includes(name)) {
                errors.push(
                    `Missing rubric criterion: ${name}`
                );
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors
    };
};