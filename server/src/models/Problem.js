import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        requirements: {
            type: [String],
            required: true
        },

        constraints: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;