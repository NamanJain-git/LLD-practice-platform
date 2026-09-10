import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
    {
        problemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true
        },

        status: {
            type: String,
            enum: [
                "DRAFT",
                "SUBMITTED",
                "EVALUATING",
                "COMPLETED",
                "FAILED"
            ],
            default: "DRAFT"
        },

        submittedAt: {
            type: Date,
            default: null
        },

        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Attempt = mongoose.model("Attempt", attemptSchema);

export default Attempt;