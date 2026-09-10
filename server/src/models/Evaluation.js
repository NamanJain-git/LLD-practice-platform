import mongoose from "mongoose";

const criterionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        score: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        evidence: {
            type: String,
            default: ""
        },

        concern: {
            type: String,
            default: ""
        },

        suggestion: {
            type: String,
            default: ""
        },

        confidence: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        }
    },
    { _id: false }
);

const evaluationSchema = new mongoose.Schema(
    {
        attemptId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attempt",
            required: true,
            unique: true
        },

        evaluatorType: {
            type: String,
            enum: ["LLM", "RULE_BASED", "HUMAN"],
            required: true
        },

        status: {
            type: String,
            enum: ["PENDING", "COMPLETED", "FAILED"],
            default: "PENDING"
        },

        criteria: {
            type: [criterionSchema],
            default: []
        },

        overallFeedback: {
            type: String,
            default: ""
        },

        strengths: {
            type: [String],
            default: []
        },

        improvements: {
            type: [String],
            default: []
        },

        errorMessage: {
            type: String,
            default: ""
        },

        evaluatedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Evaluation = mongoose.model("Evaluation", evaluationSchema);

export default Evaluation;