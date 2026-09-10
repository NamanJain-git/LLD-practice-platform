export const validateEvaluationInput = (problem, submission) => {
    const errors = [];

    if (!problem) {
        errors.push("Problem data is missing");
    }

    if (!submission) {
        errors.push("Submission data is missing");
    }

    if (submission) {
        if (!submission.approach?.trim()) {
            errors.push("Approach is missing");
        }

        if (!submission.classes?.trim()) {
            errors.push("Classes are missing");
        }

        if (!submission.relationships?.trim()) {
            errors.push("Relationships are missing");
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
};