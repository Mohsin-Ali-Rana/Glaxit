import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <section className="hero">

      <div className="hero-content">

        <span className="tag">
          React Router Demo
        </span>

        <h1>
          Build Modern React Applications
        </h1>

        <p>
          This project demonstrates client-side routing using
          BrowserRouter, Routes, Route, Link, and useNavigate while
          maintaining a clean, responsive, and production-inspired UI.
        </p>

        <div className="buttons">

          <Link to="/about" className="primary-btn">
            Learn More
          </Link>

          <a
            href="https://react.dev"
            target="_blank"
            rel="noreferrer"
            className="secondary-btn"
          >
            React Docs
          </a>

        </div>

      </div>

    </section>
  );
}

export default Home;