// Theme Toggle Function
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("themeBtn");

  if (body.getAttribute("data-theme") === "light") {
    body.removeAttribute("data-theme");
    btn.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "dark");
  } else {
    body.setAttribute("data-theme", "light");
    btn.textContent = "☀️ Light Mode";
    localStorage.setItem("theme", "light");
  }
}

// Load saved theme on page load
document.addEventListener("DOMContentLoaded", function () {
  const savedTheme = localStorage.getItem("theme");
  const btn = document.getElementById("themeBtn");

  if (savedTheme === "light") {
    document.body.setAttribute("data-theme", "light");
    if (btn) btn.textContent = "☀️ Light Mode";
  } else {
    // Default to dark
    document.body.removeAttribute("data-theme");
    if (btn) btn.textContent = "🌙 Dark Mode";
  }
});
