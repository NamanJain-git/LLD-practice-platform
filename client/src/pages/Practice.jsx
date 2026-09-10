import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getAttemptById,
    saveSubmission,
    submitAttempt,
    evaluateAttempt
} from "../services/api";

import "./Practice.css";

const initialForm = {
    approach: "",
    classes: "",
    relationships: "",
    abstractions: "",
    patterns: "",
    assumptions: "",
    edgeCases: ""
};

function Practice() {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [attempt, setAttempt] = useState(null);
    const [form, setForm] = useState(initialForm);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        const loadAttempt = async () => {
            try {
                const data = await getAttemptById(attemptId);

                setAttempt(data);

                if (data.submission) {
                    setForm({
                        approach: data.submission.approach || "",
                        classes: data.submission.classes || "",
                        relationships:
                            data.submission.relationships || "",
                        abstractions:
                            data.submission.abstractions || "",
                        patterns:
                            data.submission.patterns || "",
                        assumptions:
                            data.submission.assumptions || "",
                        edgeCases:
                            data.submission.edgeCases || ""
                    });
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadAttempt();
    }, [attemptId]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSaveDraft = async () => {
        try {
            setSaving(true);
            setError("");

            await saveSubmission(attemptId, form);

            alert("Draft saved successfully.");
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            setError("");

            await saveSubmission(attemptId, form);

            await submitAttempt(attemptId);

            await evaluateAttempt(attemptId);

            navigate(`/evaluation/${attemptId}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="practice-state">
                Loading practice...
            </div>
        );
    }

    if (error && !attempt) {
        return (
            <div className="practice-state error-state">
                {error}
            </div>
        );
    }

    if (!attempt) {
        return (
            <div className="practice-state">
                Attempt not found.
            </div>
        );
    }

    const problem = attempt.problemId;

    return (
        <div className="practice-page">

            {/* Header */}

            <header className="practice-header">
                <div className="practice-header-inner">

                    <button
                        className="back-button"
                        onClick={() => navigate("/")}
                    >
                        ← Problems
                    </button>

                    <div className="practice-title"> <span>LLD Practice</span>
                        <span className="separator">/</span>
                        <strong>{problem.title}</strong>
                    </div>

                    <button className="draft-button" onClick={() => navigate("/history")} >History </button>

                </div>
            </header>

            {/* Main */}

            <main className="practice-container">

                {/* Problem */}

                <aside className="problem-panel">

                    <div className="problem-panel-header">
                        <span className="panel-label">
                            PROBLEM
                        </span>

                        <span className="difficulty-badge">
                            {problem.difficulty}
                        </span>
                    </div>

                    <h1>{problem.title}</h1>

                    <p className="problem-description-full">
                        {problem.description}
                    </p>

                    <div className="requirements-block">

                        <h3>Requirements</h3>

                        <ul>
                            {problem.requirements.map(
                                (requirement, index) => (
                                    <li key={index}>
                                        {requirement}
                                    </li>
                                )
                            )}
                        </ul>

                    </div>

                    {problem.constraints?.length > 0 && (
                        <div className="requirements-block">

                            <h3>Constraints</h3>

                            <ul>
                                {problem.constraints.map(
                                    (constraint, index) => (
                                        <li key={index}>
                                            {constraint}
                                        </li>
                                    )
                                )}
                            </ul>

                        </div>
                    )}

                    <div className="design-tip">
                        <strong>💡 Design tip</strong>

                        <p>
                            Focus on responsibilities,
                            relationships and trade-offs.
                            There may be multiple valid
                            solutions.
                        </p>
                    </div>

                </aside>

                {/* Submission */}

                <section className="submission-panel">

                    <div className="submission-header">
                        <div>
                            <span className="panel-label">
                                YOUR DESIGN
                            </span>

                            <h2>
                                Describe your solution
                            </h2>

                            <p>
                                Explain your design clearly.
                                You don't need to write
                                production code.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    <div className="form-fields">

                        <FormField
                            label="Approach"
                            name="approach"
                            value={form.approach}
                            onChange={handleChange}
                            placeholder="Explain your overall approach and how the system should work..."
                        />

                        <FormField
                            label="Classes & Responsibilities"
                            name="classes"
                            value={form.classes}
                            onChange={handleChange}
                            placeholder="List the important classes and explain what each class is responsible for..."
                        />

                        <FormField
                            label="Relationships"
                            name="relationships"
                            value={form.relationships}
                            onChange={handleChange}
                            placeholder="Explain how the classes interact with and depend on each other..."
                        />

                        <FormField
                            label="Abstractions & Interfaces"
                            name="abstractions"
                            value={form.abstractions}
                            onChange={handleChange}
                            placeholder="Describe important interfaces or abstractions..."
                        />

                        <FormField
                            label="Design Patterns"
                            name="patterns"
                            value={form.patterns}
                            onChange={handleChange}
                            placeholder="Which patterns would you use and why?"
                        />

                        <FormField
                            label="Assumptions & Trade-offs"
                            name="assumptions"
                            value={form.assumptions}
                            onChange={handleChange}
                            placeholder="Mention assumptions and important design trade-offs..."
                        />

                        <FormField
                            label="Edge Cases & Testability"
                            name="edgeCases"
                            value={form.edgeCases}
                            onChange={handleChange}
                            placeholder="What edge cases should the design handle? How would you test it?"
                        />

                    </div>

                    {/* Actions */}

                    <div className="submission-actions">

                        <button
                            className="draft-button"
                            onClick={handleSaveDraft}
                            disabled={saving || submitting}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Draft"}
                        </button>

                        <button
                            className="submit-button"
                            onClick={handleSubmit}
                            disabled={submitting || saving}
                        >
                            {submitting
                                ? "Evaluating..."
                                : "Submit & Get Feedback →"}
                        </button>

                    </div>

                    {submitting && (
                        <p className="evaluation-note">
                            Your submission is being evaluated by
                            the AI evaluator. This may take a few
                            seconds...
                        </p>
                    )}

                </section>

            </main>

        </div>
    );
}

function FormField({
    label,
    name,
    value,
    onChange,
    placeholder
}) {
    return (
        <div className="form-field">

            <label htmlFor={name}>
                {label}
            </label>

            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={4}
            />

        </div>
    );
}

export default Practice;