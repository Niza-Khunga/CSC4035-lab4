// Theme Switching Functionality
document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle button
  const themeToggle = document.getElementById("themeToggle");

  // Check for saved theme preference or use preferred color scheme
  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  // Apply the saved theme
  document.documentElement.setAttribute("data-theme", savedTheme);

  // Update button text based on current theme
  updateButtonText(savedTheme);

  // Toggle theme when button is clicked
  themeToggle.addEventListener("click", toggleTheme);

  // Function to toggle between light and dark themes
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    // Apply new theme
    document.documentElement.setAttribute("data-theme", newTheme);

    // Save to localStorage
    localStorage.setItem("theme", newTheme);

    // Update button text
    updateButtonText(newTheme);
  }

  // Update the theme toggle button text
  function updateButtonText(theme) {
    themeToggle.textContent =
      theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  }

  // Optional: Handle service parameter in contact form
  handleServiceParameter();
});

// Optional: Service parameter handling for contact.html
function handleServiceParameter() {
  const contactForm = document.querySelector(".contact-form form");
  if (!contactForm) return;

  const params = new URLSearchParams(window.location.search);
  const service = params.get("service");

  if (service) {
    const subjectField = document.getElementById("subject");
    if (subjectField) {
      const serviceName = service.charAt(0).toUpperCase() + service.slice(1);
      subjectField.value = `${serviceName} Legal Inquiry`;
    }

    // Optional: Add hidden input to track service source
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "service_type";
    hiddenInput.value = service;
    contactForm.appendChild(hiddenInput);
  }
}
