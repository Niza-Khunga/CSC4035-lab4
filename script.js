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
// Enhanced Contact Form Validation
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector(".contact-form form");

  if (contactForm) {
    // Create response message element
    const responseDiv = document.createElement("div");
    responseDiv.id = "form-response";
    responseDiv.style.marginTop = "1rem";
    contactForm.appendChild(responseDiv);

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      // Clear previous errors
      clearErrors();

      // Validate form
      if (validateForm(name, email, subject, message)) {
        // Show success message
        showResponse(
          `Thanks, ${name}! We'll get back to you soon about "${subject}".`,
          "success"
        );

        // Optional: Submit form data to server here
        // submitFormData(name, email, subject, message);

        // Reset form
        contactForm.reset();

        // Focus back to name field
        document.getElementById("name").focus();
      }
    });
  }

  function validateForm(name, email, subject, message) {
    let isValid = true;

    if (name === "") {
      showError("name", "Please enter your name");
      isValid = false;
    }

    if (email === "") {
      showError("email", "Please enter your email");
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError("email", "Please enter a valid email");
      isValid = false;
    }

    if (subject === "") {
      showError("subject", "Please enter a subject");
      isValid = false;
    } else if (subject.length < 5) {
      showError("subject", "Subject should be at least 5 characters");
      isValid = false;
    }

    if (message === "") {
      showError("message", "Please enter your message");
      isValid = false;
    } else if (message.length < 20) {
      showError("message", "Message should be at least 20 characters");
      isValid = false;
    }

    return isValid;
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest(".form-group");

    // Add error class to form group
    formGroup.classList.add("error");

    // Create or update error message
    let errorElement = formGroup.querySelector(".error-message");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "error-message";
      errorElement.style.color = "#ef4444";
      errorElement.style.marginTop = "0.25rem";
      errorElement.style.fontSize = "0.875rem";
      formGroup.appendChild(errorElement);
    }

    errorElement.textContent = message;
  }

  function clearErrors() {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => msg.remove());

    const errorGroups = document.querySelectorAll(".form-group.error");
    errorGroups.forEach((group) => group.classList.remove("error"));
  }

  function showResponse(message, type) {
    const responseDiv = document.getElementById("form-response");
    responseDiv.textContent = message;
    responseDiv.style.padding = "1rem";
    responseDiv.style.borderRadius = "0.375rem";

    if (type === "success") {
      responseDiv.style.backgroundColor = "#d1fae5";
      responseDiv.style.color = "#065f46";
    } else {
      responseDiv.style.backgroundColor = "#fee2e2";
      responseDiv.style.color = "#b91c1c";
    }

    // Auto-hide after 5 seconds
    setTimeout(() => {
      responseDiv.textContent = "";
      responseDiv.style.backgroundColor = "";
      responseDiv.style.color = "";
      responseDiv.style.padding = "0";
    }, 5000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Optional: Form data submission
  function submitFormData(name, email, subject, message) {
    fetch("https://your-api-endpoint.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
        showResponse(
          "There was an error submitting your form. Please try again later.",
          "error"
        );
      });
  }
});
// Team Members API Integration
document.addEventListener("DOMContentLoaded", () => {
  const loadUsersBtn = document.getElementById("loadUsersBtn");

  if (loadUsersBtn) {
    loadUsersBtn.addEventListener("click", loadUsers);
  }
});

async function loadUsers() {
  const userList = document.getElementById("userList");
  const loadBtn = document.getElementById("loadUsersBtn");

  try {
    // Show loading state
    loadBtn.classList.add("loading");
    loadBtn.disabled = true;

    // Fetch users
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const users = await response.json();

    // Clear previous list
    userList.innerHTML = "";

    // Populate new list
    users.forEach((user) => {
      const li = document.createElement("li");
      li.innerHTML = `
          <strong>${user.name}</strong>
          <span class="user-email">${user.email}</span>
        `;
      userList.appendChild(li);
    });
  } catch (error) {
    userList.innerHTML = `<li class="error">Failed to load team members. Please try again later.</li>`;
    console.error("Fetch error:", error);
  } finally {
    // Reset button state
    loadBtn.classList.remove("loading");
    loadBtn.disabled = false;
  }
}
// FAQ Accordion Functionality
document.addEventListener("DOMContentLoaded", () => {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const isExpanded = question.getAttribute("aria-expanded") === "true";
      const answer = document.getElementById(
        question.getAttribute("aria-controls")
      );

      // Toggle state
      question.setAttribute("aria-expanded", !isExpanded);

      // Toggle answer visibility with animation
      if (isExpanded) {
        answer.style.maxHeight = "0";
      } else {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }

      // Optional: Close other FAQs when opening one
      // faqQuestions.forEach(q => {
      //   if (q !== question) {
      //     q.setAttribute('aria-expanded', 'false');
      //     document.getElementById(q.getAttribute('aria-controls')).style.maxHeight = '0';
      //   }
      // });
    });

    // Initialize heights for server-side rendering
    if (question.getAttribute("aria-expanded") === "true") {
      const answer = document.getElementById(
        question.getAttribute("aria-controls")
      );
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});
// Real-Time Clock
function updateClock() {
  const now = new Date();
  const clockElement = document.getElementById("headerClock");
  if (clockElement) {
    clockElement.textContent = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
}

// Initialize clock
document.addEventListener("DOMContentLoaded", () => {
  // Add clock element to header (if not already in HTML)
  const header = document.querySelector("header");
  if (header && !document.getElementById("headerClock")) {
    const clockDiv = document.createElement("div");
    clockDiv.id = "headerClock";
    clockDiv.style.marginLeft = "auto";
    clockDiv.style.padding = "0 1rem";
    clockDiv.style.fontWeight = "500";
    header.querySelector(".navbar").appendChild(clockDiv);
  }

  updateClock();
  setInterval(updateClock, 1000);
});
// Image Slider
function initSlider() {
  const images = document.querySelectorAll(".slider img");
  let current = 0;

  if (images.length > 0) {
    setInterval(() => {
      images[current].style.display = "none";
      current = (current + 1) % images.length;
      images[current].style.display = "block";
    }, 5000);
  }
}

// Call this in DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  initSlider();
});
// Back to Top Button
function initBackToTop() {
  const button = document.createElement("button");
  button.className = "back-to-top";
  button.innerHTML = "↑";
  button.setAttribute("aria-label", "Back to top");
  document.body.appendChild(button);

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      button.classList.add("visible");
    } else {
      button.classList.remove("visible");
    }
  });

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Call this in DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  initBackToTop();
});
