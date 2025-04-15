// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", (event) => {
  // Theme Toggle
  const themeToggle = document.querySelector(".theme-toggle");
  const body = document.body;
  const themeIcon = document.querySelector(".theme-toggle i");

  // Function to apply theme based on preference
  const applyTheme = (theme) => {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      if (themeIcon) themeIcon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark-mode");
      if (themeIcon) themeIcon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "light");
    }
  };

  // Check for saved theme preference or use OS preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme(prefersDark ? "dark" : "light");
  }

  // Add event listener for theme toggle button
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = body.classList.contains("dark-mode")
        ? "dark"
        : "light";
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const menu = document.getElementById("menu");
  const menuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector("i") : null;

  if (mobileMenuBtn && menu && menuIcon) {
    mobileMenuBtn.addEventListener("click", () => {
      menu.classList.toggle("show");
      if (menu.classList.contains("show")) {
        menuIcon.classList.replace("fa-bars", "fa-times");
      } else {
        menuIcon.classList.replace("fa-times", "fa-bars");
      }
    });

    // Close mobile menu when clicking on a menu item
    const menuItems = document.querySelectorAll("#menu a");
    menuItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (menu.classList.contains("show")) {
          menu.classList.remove("show");
          menuIcon.classList.replace("fa-times", "fa-bars");
        }
      });
    });

    // Close mobile menu if clicking outside of it (optional)
    document.addEventListener("click", (e) => {
      if (
        !menu.contains(e.target) &&
        !mobileMenuBtn.contains(e.target) &&
        menu.classList.contains("show")
      ) {
        menu.classList.remove("show");
        menuIcon.classList.replace("fa-times", "fa-bars");
      }
    });
  }

  // Scroll Animation using Intersection Observer
  const observerOptions = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.1, // trigger when 10% of the element is visible
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observe elements targeted for animation
  // Note: Hero elements are handled separately on load
  document
    .querySelectorAll(
      ".about-image, .about-text, .timeline-item, .project-card, .contact-info, .contact-form"
    )
    .forEach((element) => {
      if (element) {
        // Check if element exists
        observer.observe(element);
      }
    });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const hrefAttribute = this.getAttribute("href");
      // Check if it's a valid internal link (not just "#")
      if (
        hrefAttribute &&
        hrefAttribute.length > 1 &&
        hrefAttribute.startsWith("#")
      ) {
        e.preventDefault();
        const targetId = hrefAttribute;
        const targetElement = document.querySelector(targetId);
        const header = document.querySelector("header");

        if (targetElement && header) {
          const headerHeight = header.offsetHeight;
          // Calculate position correctly, considering scroll offset and header height
          const targetPosition =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        } else if (targetElement) {
          // Fallback if header not found
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent default form submission

      const formData = new FormData(contactForm);
      const status = document.getElementById("form-status");
      const nameInput = document.getElementById("name");
      const name = nameInput ? nameInput.value : "there";

      // Optional basic validation
      if (!formData.get("email") || !formData.get("message")) {
        alert("Please fill in all required fields.");
        return;
      }

      fetch(contactForm.action, {
        method: contactForm.method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            if (status) {
              status.innerHTML =
                "<span style='color: green;'>✅ Message sent successfully!</span>";
            } else {
              alert(
                `Thanks for your message, ${name}! I'll get back to you soon.`
              );
            }
            contactForm.reset();
          } else {
            response.json().then((data) => {
              const errorMsg = data.errors
                ? data.errors.map((err) => err.message).join(", ")
                : "Something went wrong. Please try again.";
              if (status) {
                status.innerHTML = `<span style='color: red;'>❌ ${errorMsg}</span>`;
              } else {
                alert(errorMsg);
              }
            });
          }
        })
        .catch((error) => {
          if (status) {
            status.innerHTML =
              "<span style='color: red;'>❌ Network error. Please try again later.</span>";
          } else {
            alert("Network error. Please try again later.");
          }
        });
    });
  }

  // Trigger Hero section animations on page load (already visible)
  // Moved from CSS initial state to JS for better control
  const heroContent = document.querySelector(".hero-content");
  const heroImage = document.querySelector(".hero-image");

  if (heroContent) {
    heroContent.style.animation = "fadeInUp 1s forwards 0.2s"; // Add slight delay
    // Directly set final state in case animations are disabled or JS fails partially
    heroContent.style.opacity = "1";
    heroContent.style.transform = "translateY(0)";
  }
  if (heroImage) {
    heroImage.style.animation = "fadeInRight 1s forwards 0.5s"; // Add slight delay
    // Directly set final state
    heroImage.style.opacity = "1";
    heroImage.style.transform = "translateX(0)";
  }
}); // End DOMContentLoaded
