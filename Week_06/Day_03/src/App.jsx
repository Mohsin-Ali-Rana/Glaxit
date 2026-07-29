import VideoPlayer from "./components/VideoPlayer";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="container">
        <h1>Custom React Video Player</h1>
        <p>
          Built using <strong>useRef</strong>, <strong>useMemo</strong> and{" "}
          <strong>useCallback</strong>.
        </p>

        <VideoPlayer />
      </div>
    </div>
  );
}

export default App;