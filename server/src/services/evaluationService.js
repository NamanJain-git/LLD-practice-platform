import Evaluation from "../models/Evaluation.js";
import Attempt from "../models/Attempt.js";
import Submission from "../models/Submission.js";
import evaluationRubric from "./rubric.js";
import { validateEvaluationInput } from "./evaluationInputValidator.js";
import { validateEvaluationResponse } from "./evaluationResponseValidator.js";

export const evaluateAttempt = async (attemptId, evaluator) => {

    const attempt = await Attempt.findById(attemptId)
        .populate("problemId");

    if (!attempt) {
        throw new Error("Attempt not found");
    }

    if (!["SUBMITTED", "FAILED"].includes(attempt.status)) {
        throw new Error(
            "Only submitted or failed attempts can be evaluated"
        );
    }

    if (attempt.status === "EVALUATING") {
        throw new Error(
            "Evaluation is already in progress"
        );
    }

    const submission = await Submission.findOne({ attemptId });

    if (!submission) {
        throw new Error("Submission not found");
    }

    const validation = validateEvaluationInput(
        attempt.problemId,
        submission
    );

    if (!validation.valid) {
        throw new Error(validation.errors.join(", "));
    }

    attempt.status = "EVALUATING";
    await attempt.save();

    let evaluation = await Evaluation.findOne({ attemptId });

    if (!evaluation) {
        evaluation = new Evaluation({
            attemptId,
            evaluatorType: evaluator.type || "LLM",
            status: "PENDING"
        });
    } else {
        evaluation.status = "PENDING";
        evaluation.errorMessage = "";
        evaluation.evaluatorType = evaluator.type || "LLM";
    }

    await evaluation.save();

    try {

        const evaluationResult = await evaluator.evaluate(
            {
                title: attempt.problemId.title,
                description: attempt.problemId.description,
                requirements: attempt.problemId.requirements,
                constraints: attempt.problemId.constraints
            },
            {
                approach: submission.approach,
                classes: submission.classes,
                relationships: submission.relationships,
                abstractions: submission.abstractions,
                patterns: submission.patterns,
                assumptions: submission.assumptions,
                edgeCases: submission.edgeCases
            },
            evaluationRubric
        );

        const responseValidation = validateEvaluationResponse(
            evaluationResult,
            evaluationRubric
        );

        if (!responseValidation.valid) {
            throw new Error(
                `Invalid evaluator response: ${responseValidation.errors.join("; ")}`
            );
        }

        evaluation.criteria = evaluationResult.criteria || [];

        evaluation.overallFeedback =
            evaluationResult.overallFeedback || "";

        evaluation.strengths =
            evaluationResult.strengths || [];

        evaluation.improvements =
            evaluationResult.improvements || [];

        evaluation.status = "COMPLETED";
        evaluation.evaluatedAt = new Date();

        await evaluation.save();

        attempt.status = "COMPLETED";
        attempt.completedAt = new Date();

        await attempt.save();

        return evaluation;
    } catch (error) {

        evaluation.status = "FAILED";
        evaluation.errorMessage = error.message;

        await evaluation.save();

        attempt.status = "FAILED";
        await attempt.save();

        throw error;
    }
};
