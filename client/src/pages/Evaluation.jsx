import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAttemptById, evaluateAttempt } from "../services/api";

import "./Evaluation.css";

function Evaluation() {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [retrying, setRetrying] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAttempt = async () => {
            try {
                const data = await getAttemptById(attemptId);
                setAttempt(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadAttempt();
    }, [attemptId]);

    const handleRetry = async () => {
        try {
            setRetrying(true);
            setError("");

            await evaluateAttempt(attemptId);

            const updatedAttempt = await getAttemptById(attemptId);

            setAttempt(updatedAttempt);
        } catch (error) {
            setError(error.message);
        } finally {
            setRetrying(false);
        }
    };

    if (loading) {
        return (
            <div className="evaluation-state">
                Loading evaluation...
            </div>
        );
    }

    if (error && !attempt) {
        return (
            <div className="evaluation-state evaluation-error">
                {error}
            </div>
        );
    }

    if (!attempt) {
        return (
            <div className="evaluation-state">
                Attempt not found.
            </div>
        );
    }

    const evaluation = attempt.evaluation;
    const problem = attempt.problemId;

    if (!evaluation) {
        return (
            <div className="evaluation-page">
                <header className="evaluation-header">
                    <button
                        onClick={() => navigate("/")}
                        className="back-button"
                    >
                        ← Problems
                    </button>

                    <h1>Evaluation</h1>
                </header>

                <main className="empty-evaluation">
                    <div className="empty-icon">◌</div>

                    <h2>No evaluation available</h2>

                    <p>
                        This attempt has not been evaluated yet.
                    </p>

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate(`/practice/${attemptId}`)
                        }
                    >
                        Continue Practice
                    </button>
                </main>
            </div>
        );
    }

    const criteria = evaluation.criteria || [];

    const totalScore = criteria.reduce(
        (total, criterion) => total + criterion.score,
        0
    );

    const maxScore = criteria.length * 5;

    const percentage =
        maxScore > 0
            ? Math.round((totalScore / maxScore) * 100)
            : 0;

    return (
        <div className="evaluation-page">

            {/* Header */}

            <header className="evaluation-header">
                <div className="evaluation-header-inner">

                    <button
                        onClick={() => navigate("/")}
                        className="back-button"
                    >
                        ← Problems
                    </button>

                    <div className="evaluation-breadcrumb">
                        <span>LLD Practice</span>
                        <span>/</span>
                        <strong>{problem.title}</strong>
                    </div>

                    <button
                        onClick={() => navigate("/history")}
                        className="history-button"
                    >
                        History
                    </button>

                </div>
            </header>

            <main className="evaluation-container">

                {/* Top section */}

                <section className="evaluation-hero">

                    <div>
                        <span className="completed-label">
                            EVALUATION COMPLETE
                        </span>

                        <h1>
                            Your design review
                        </h1>

                        <p>
                            Here's how your solution performed
                            against the LLD evaluation rubric.
                        </p>
                    </div>

                    <div className="score-card">

                        <div className="score-number">
                            {totalScore}
                            <span>/{maxScore}</span>
                        </div>

                        <div className="score-label">
                            Overall Score
                        </div>

                        <div className="score-percentage">
                            {percentage}%
                        </div>

                    </div>

                </section>

                {/* Overall feedback */}

                <section className="feedback-card">

                    <div className="section-title">
                        <span>01</span>
                        <h2>Overall feedback</h2>
                    </div>

                    <p className="overall-feedback">
                        {evaluation.overallFeedback}
                    </p>

                </section>

                {/* Strengths + Improvements */}

                <section className="feedback-columns">

                    <div className="feedback-card">

                        <div className="section-title">
                            <span>02</span>
                            <h2>Strengths</h2>
                        </div>

                        <ul className="feedback-list strengths">
                            {evaluation.strengths?.map(
                                (strength, index) => (
                                    <li key={index}>
                                        <span>✓</span>
                                        {strength}
                                    </li>
                                )
                            )}
                        </ul>

                    </div>

                    <div className="feedback-card">

                        <div className="section-title">
                            <span>03</span>
                            <h2>Improvements</h2>
                        </div>

                        <ul className="feedback-list improvements">
                            {evaluation.improvements?.map(
                                (improvement, index) => (
                                    <li key={index}>
                                        <span>→</span>
                                        {improvement}
                                    </li>
                                )
                            )}
                        </ul>

                    </div>

                </section>

                {/* Rubric */}

                <section className="rubric-section">

                    <div className="rubric-heading">
                        <div>
                            <span className="completed-label">
                                RUBRIC REVIEW
                            </span>

                            <h2>
                                Detailed evaluation
                            </h2>

                            <p>
                                Evidence-based feedback for
                                each design criterion.
                            </p>
                        </div>
                    </div>

                    <div className="criteria-list">

                        {criteria.map(
                            (criterion, index) => (
                                <CriterionCard
                                    key={index}
                                    criterion={criterion}
                                    index={index}
                                />
                            )
                        )}

                    </div>

                </section>

                {/* Actions */}

                <section className="evaluation-actions">

                    <div className="evaluation-actions">
                        {attempt.status === "FAILED" && (
                            <button className="secondary-button" onClick={handleRetry} disabled={retrying} >
                                {retrying ? "Retrying..." : "Retry Evaluation"}
                            </button>
                        )}

                        <button className="secondary-button" onClick={() => navigate("/")} >
                            Practice Another Problem
                        </button>

                        <button className="primary-button" onClick={() => navigate(`/practice/${attemptId}`)} >
                            View My Submission
                        </button>
                    </div>

                </section>

                {error && (
                    <div className="retry-error">
                        {error}

                        <button
                            onClick={handleRetry}
                            disabled={retrying}
                        >
                            {retrying
                                ? "Retrying..."
                                : "Retry Evaluation"}
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
}

function CriterionCard({ criterion, index }) {
    const score = criterion.score || 0;

    return (
        <article className="criterion-card">

            <div className="criterion-top">

                <div className="criterion-title">

                    <span className="criterion-number">
                        {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>
                        {criterion.name}
                    </h3>

                </div>

                <div className="criterion-score">
                    <strong>{score}</strong>
                    <span>/ 5</span>
                </div>

            </div>

            <div className="score-bar">
                <div
                    className="score-bar-fill"
                    style={{
                        width: `${score * 20}%`
                    }}
                />
            </div>

            <div className="criterion-content">

                <div className="feedback-block">
                    <span>Evidence</span>

                    <p>
                        {criterion.evidence}
                    </p>
                </div>

                <div className="feedback-block">
                    <span>Concern</span>

                    <p>
                        {criterion.concern}
                    </p>
                </div>

                <div className="feedback-block">
                    <span>Suggestion</span>

                    <p>
                        {criterion.suggestion}
                    </p>
                </div>

            </div>

            <div className="confidence">
                Confidence:
                <strong>
                    {criterion.confidence}
                </strong>
            </div>

        </article>
    );
}

export default Evaluation;