const API_URL = "http://localhost:5000/api";

const request = async (url, options = {}) => {
    const response = await fetch(`${API_URL}${url}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Something went wrong"
        );
    }

    return data;
};

export const getProblems = () =>
    request("/problems");

export const getProblemById = (id) =>
    request(`/problems/${id}`);

export const createAttempt = (problemId) =>
    request("/attempts", {
        method: "POST",
        body: JSON.stringify({ problemId })
    });

export const getAttemptById = (id) =>
    request(`/attempts/${id}`);

export const saveSubmission = (attemptId, submission) =>
    request(`/attempts/${attemptId}`, {
        method: "PUT",
        body: JSON.stringify(submission)
    });

export const submitAttempt = (attemptId) =>
    request(`/attempts/${attemptId}/submit`, {
        method: "POST"
    });

export const evaluateAttempt = (attemptId) =>
    request(`/attempts/${attemptId}/evaluate`, {
        method: "POST"
    });

export const getAttempts = () =>
    request("/attempts");