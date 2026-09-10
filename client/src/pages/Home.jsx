import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getProblems,
    createAttempt
} from "../services/api";
import "./Home.css";

function Home() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const loadProblems = async () => {
            try {
                const data = await getProblems();
                setProblems(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadProblems();
    }, []);

    const handleStart = async (problemId) => {
        try {
            const attempt = await createAttempt(problemId);
            navigate(`/practice/${attempt._id}`);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="home-page">

            <nav className="navbar">
                <div className="navbar-inner">
                    <div>
                        <h1 className="logo">
                            LLD Practice
                        </h1>

                        <p className="logo-subtitle">
                            Design. Submit. Improve.
                        </p>
                    </div>

                    <button
                        className="history-button"
                        onClick={() => navigate("/history")}
                    >
                        History
                    </button>
                </div>
            </nav>

            <main>

                <section className="hero">
                    <div className="hero-content">

                        <span className="hero-badge">
                            LLD Practice Platform
                        </span>

                        <h2>
                            Practice system design.
                            <br />
                            Get meaningful feedback.
                        </h2>

                        <p>
                            Design classes, responsibilities and
                            relationships for real-world systems.
                            Submit your solution and receive
                            explainable AI feedback.
                        </p>

                    </div>
                </section>

                <section className="problems-section">

                    <div className="section-header">
                        <h3>Choose a problem</h3>

                        <p>
                            Pick a system and start designing.
                        </p>
                    </div>

                    {loading && (
                        <p className="loading">
                            Loading problems...
                        </p>
                    )}

                    {error && (
                        <div className="error">
                            {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="problems-grid">

                            {problems.map((problem) => (
                                <div
                                    className="problem-card"
                                    key={problem._id}
                                >

                                    <div className="card-top">
                                        <span className="difficulty">
                                            {problem.difficulty}
                                        </span>

                                        <span className="card-type">
                                            LLD
                                        </span>
                                    </div>

                                    <h4>
                                        {problem.title}
                                    </h4>

                                    <p className="problem-description">
                                        {problem.description}
                                    </p>

                                    <button
                                        className="start-button"
                                        onClick={() =>
                                            handleStart(problem._id)
                                        }
                                    >
                                        Start Practice
                                    </button>

                                </div>
                            ))}

                        </div>
                    )}

                </section>

            </main>

        </div>
    );
}

export default Home;