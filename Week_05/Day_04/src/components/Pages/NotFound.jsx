import { useNavigate } from "react-router-dom";
import "./NotFound.css";

function NotFound() {

  const navigate = useNavigate();

  return (

    <section className="notfound">

      <h1>404</h1>

      <h2>Oops! Page Not Found</h2>

      <p>
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <button onClick={() => navigate("/")}>
        Return Home
      </button>

    </section>

  );
}

export default NotFound;