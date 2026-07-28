import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <input
        type="text"
        placeholder="Search transactions..."
        className="search"
      />

      <div className="right-nav">
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>

        <div className="profile">MA</div>
      </div>
    </nav>
  );
}

export default Navbar;