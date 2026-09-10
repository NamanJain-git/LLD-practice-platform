import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import problemRoutes from "./routes/problemRoutes.js";
import attemptRoutes from "./routes/attemptRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "LLD Practice API is running"
    });
});

app.use("/api/problems", problemRoutes);
app.use("/api/attempts", attemptRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});