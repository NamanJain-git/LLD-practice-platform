import Attempt from "../models/Attempt.js";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import Evaluation from "../models/Evaluation.js";

export const createAttempt = async (req, res) => {
    try {
        const { problemId } = req.body;

        if (!problemId) {
            return res.status(400).json({
                message: "problemId is required"
            });
        }

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        const attempt = await Attempt.create({
            problemId
        });

        res.status(201).json(attempt);
    } catch (error) {
        console.error("Error creating attempt:", error.message);

        res.status(500).json({
            message: "Failed to create attempt"
        });
    }
};

export const getAttempts = async (req, res) => {
    try {
        const attempts = await Attempt.find()
            .populate("problemId", "title difficulty")
            .sort({ createdAt: -1 });

        res.status(200).json(attempts);
    } catch (error) {
        console.error("Error fetching attempts:", error.message);

        res.status(500).json({
            message: "Failed to fetch attempts"
        });
    }
};

export const getAttemptById = async (req, res) => {
    try {
        const attempt = await Attempt.findById(req.params.id)
            .populate(
                "problemId",
                "title difficulty description requirements constraints"
            );

        if (!attempt) {
            return res.status(404).json({
                message: "Attempt not found"
            });
        }
        
        const submission = await Submission.findOne({
            attemptId: attempt._id
        });

        const evaluation = await Evaluation.findOne({
            attemptId: attempt._id
        });

        res.status(200).json({
            ...attempt.toObject(),
            submission,
            evaluation
        });

    } catch (error) {
        console.error(
            "Error fetching attempt:",
            error.message
        );

        res.status(500).json({
            message: "Failed to fetch attempt"
        });
    }
};

export const saveDraftSubmission = async (req, res) => {
    try {
        const { id: attemptId } = req.params;

        const attempt = await Attempt.findById(attemptId);

        if (!attempt) {
            return res.status(404).json({
                message: "Attempt not found"
            });
        }

        if (attempt.status !== "DRAFT") {
            return res.status(409).json({
                message: "Only draft attempts can be edited"
            });
        }

        const submission = await Submission.findOneAndUpdate(
            { attemptId },
            req.body,
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.status(200).json(submission);

    } catch (error) {
        console.error(
            "Error saving submission:",
            error.message
        );

        res.status(500).json({
            message: "Failed to save submission"
        });
    }
};

export const submitAttempt = async (req, res) => {
    try {
        const { id: attemptId } = req.params;

        // 1. Find the attempt
        const attempt = await Attempt.findById(attemptId);

        if (!attempt) {
            return res.status(404).json({
                message: "Attempt not found"
            });
        }

        // 2. Only DRAFT attempts can be submitted
        if (attempt.status !== "DRAFT") {
            return res.status(409).json({
                message: "Only draft attempts can be submitted"
            });
        }

        // 3. Find the submission
        const submission = await Submission.findOne({
            attemptId
        });

        if (!submission) {
            return res.status(400).json({
                message:
                    "Please save your solution before submitting"
            });
        }

        // 4. Check required sections
        const requiredFields = [
            "approach",
            "classes",
            "relationships"
        ];

        const missingFields = requiredFields.filter(
            (field) => !submission[field]?.trim()
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                message:
                    "Please complete the required sections before submitting",
                missingFields
            });
        }

        // 5. Change attempt status
        attempt.status = "SUBMITTED";
        attempt.submittedAt = new Date();

        await attempt.save();

        // 6. Return updated attempt
        res.status(200).json({
            message: "Attempt submitted successfully",
            attempt
        });

    } catch (error) {
        console.error(
            "Error submitting attempt:",
            error.message
        );

        res.status(500).json({
            message: "Failed to submit attempt"
        });
    }
};