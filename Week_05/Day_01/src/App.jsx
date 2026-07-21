import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <>
      <Navbar title="My React Website" />

      <Hero
        heading="Welcome to React"
        description="This is a simple landing page built using React components and props."
      />

      <Footer copyright="© 2026 My React Website. All Rights Reserved." />
    </>
  );
}

export default App;