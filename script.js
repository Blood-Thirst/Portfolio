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

  // Contact Form submission (basic alert functionality)
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent default form submission

      // Get form data (optional, as we only show alert now)
      const nameInput = document.getElementById("name");
      const name = nameInput ? nameInput.value : "there"; // Fallback name

      // Basic validation example (can be expanded)
      if (
        !document.getElementById("email").value ||
        !document.getElementById("message").value
      ) {
        alert("Please fill in all required fields.");
        return;
      }

      // Replace with actual form submission logic (e.g., fetch API call)
      console.log("Form submitted (simulated)");
      console.log("Name:", document.getElementById("name").value);
      console.log("Email:", document.getElementById("email").value);
      console.log("Subject:", document.getElementById("subject").value);
      console.log("Message:", document.getElementById("message").value);

      // Show confirmation alert
      alert(`Thanks for your message, ${name}! I'll get back to you soon.`);

      // Reset form after submission
      contactForm.reset();
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

  // Skill tag hover effect (alternative using JS if needed, CSS handles it now)
  /*
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'translateY(-3px)';
        });
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'translateY(0)';
        });
    });
    */
}); // End DOMContentLoaded
