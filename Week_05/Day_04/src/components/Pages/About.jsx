import { useNavigate } from "react-router-dom";
import "./About.css";

function About() {

  const navigate = useNavigate();

  return (

    <section className="about">

      <div className="about-card">

        <h2>About This Project</h2>

        <p>
          This application demonstrates modern client-side routing in
          React using react-router-dom. Instead of reloading the page,
          React updates only the necessary components, creating a fast
          and smooth user experience.
        </p>

        <div className="feature-list">

          <div className="feature">
            ✔ BrowserRouter
          </div>

          <div className="feature">
            ✔ Routes & Route
          </div>

          <div className="feature">
            ✔ Link Navigation
          </div>

          <div className="feature">
            ✔ useNavigate Hook
          </div>

          <div className="feature">
            ✔ Dynamic 404 Page
          </div>

        </div>

        <button
          onClick={() => navigate("/")}
          className="back-btn"
        >
          ← Back Home
        </button>

      </div>

    </section>

  );
}

export default About;