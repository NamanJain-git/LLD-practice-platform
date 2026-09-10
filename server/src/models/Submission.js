import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
    {
        attemptId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attempt",
            required: true,
            unique: true
        },

        approach: {
            type: String,
            trim: true,
            default: ""
        },

        classes: {
            type: String,
            trim: true,
            default: ""
        },

        relationships: {
            type: String,
            trim: true,
            default: ""
        },

        abstractions: {
            type: String,
            trim: true,
            default: ""
        },

        patterns: {
            type: String,
            trim: true,
            default: ""
        },

        assumptions: {
            type: String,
            trim: true,
            default: ""
        },

        edgeCases: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;

