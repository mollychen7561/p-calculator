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
        {isChecked ? "Dark Mode" : "Light Mode"}
      </label>
    </div>
  );
}

export default ThemeToggle;
