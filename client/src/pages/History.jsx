import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAttempts } from "../services/api";

import "./History.css";

function History() {
    const navigate = useNavigate();

    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAttempts = async () => {
            try {
                const data = await getAttempts();
                setAttempts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadAttempts();
    }, []);

    const getStatusClass = (status) => {
        return `history-status status-${status.toLowerCase()}`;
    };

    const getAction = (attempt) => {
        switch (attempt.status) {
            case "DRAFT":
                return (
                    <button
                        className="history-action primary"
                        onClick={() =>
                            navigate(
                                `/practice/${attempt._id}`
                            )
                        }
                    >
                        Continue
                    </button>
                );

            case "COMPLETED":
                return (
                    <button
                        className="history-action"
                        onClick={() =>
                            navigate(
                                `/evaluation/${attempt._id}`
                            )
                        }
                    >
                        View Feedback
                    </button>
                );

            case "FAILED":
                return (
                    <button
                        className="history-action"
                        onClick={() =>
                            navigate(
                                `/evaluation/${attempt._id}`
                            )
                        }
                    >
                        View Result
                    </button>
                );

            case "SUBMITTED":
            case "EVALUATING":
                return (
                    <button
                        className="history-action"
                        onClick={() =>
                            navigate(
                                `/evaluation/${attempt._id}`
                            )
                        }
                    >
                        View Status
                    </button>
                );

            default:
                return null;
        }
    };

    return (
        <div className="history-page">

            <header className="history-header">
                <div className="history-header-inner">

                    <button
                        className="back-button"
                        onClick={() => navigate("/")}
                    >
                        ← Problems
                    </button>

                    <div className="history-heading">
                        <span>LLD Practice</span>
                        <strong>History</strong>
                    </div>

                </div>
            </header>

            <main className="history-container">

                <div className="history-intro">
                    <div>
                        <span className="history-label">
                            PRACTICE HISTORY
                        </span>

                        <h1>
                            Your attempts
                        </h1>

                        <p>
                            Review previous designs, continue
                            drafts and learn from your feedback.
                        </p>
                    </div>

                    <button
                        className="new-practice-button"
                        onClick={() => navigate("/")}
                    >
                        + New Practice
                    </button>
                </div>

                {loading && (
                    <div className="history-state">
                        Loading history...
                    </div>
                )}

                {error && (
                    <div className="history-error">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    attempts.length === 0 && (
                        <div className="empty-history">
                            <h2>
                                No attempts yet
                            </h2>

                            <p>
                                Start your first LLD problem
                                to see it here.
                            </p>

                            <button
                                className="new-practice-button"
                                onClick={() =>
                                    navigate("/")
                                }
                            >
                                Start Practicing
                            </button>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    attempts.length > 0 && (
                        <div className="attempt-list">

                            {attempts.map((attempt) => (
                                <div
                                    className="attempt-card"
                                    key={attempt._id}
                                >

                                    <div className="attempt-info">

                                        <div className="attempt-top">

                                            <h2>
                                                {
                                                    attempt
                                                        .problemId
                                                        ?.title
                                                }
                                            </h2>

                                            <span
                                                className={getStatusClass(
                                                    attempt.status
                                                )}
                                            >
                                                {attempt.status}
                                            </span>

                                        </div>

                                        <div className="attempt-meta">

                                            <span>
                                                {
                                                    attempt
                                                        .problemId
                                                        ?.difficulty
                                                }
                                            </span>

                                            <span>
                                                •
                                            </span>

                                            <span>
                                                {formatDate(
                                                    attempt.updatedAt
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    <div>
                                        {getAction(attempt)}
                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

            </main>
        </div>
    );
}

function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}

export default History;