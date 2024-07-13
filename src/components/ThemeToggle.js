import "./ThemeToggle.css";

// Change theme
function ThemeToggle({ handleChange, isChecked }) {
  return (
    <div className="toggle-container">
      <input
        type="checkbox"
        id="check"
        className="toggle"
        onChange={handleChange}
        checked={isChecked}
      />
      <label htmlFor="check" className="label">
        {isChecked ? "Light Mode" : "Dark Mode"}
      </label>
    </div>
  );
}

export default ThemeToggle;
