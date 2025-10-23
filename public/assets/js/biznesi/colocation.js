/**
 * COLOCATION PAGE - MODERN JAVASCRIPT
 * Features: Form validation, animations, smooth scrolling
 */

(function () {
  "use strict";

  // ===================================
  // MOBILE MENU
  // ===================================
  const hamburgerBtn = document.getElementById("hamburger-btn-colo");
  const mobileMenu = document.getElementById("mobile-menu-colo");

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", function () {
      const isExpanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
      hamburgerBtn.setAttribute("aria-expanded", !isExpanded);
      hamburgerBtn.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      document.body.style.overflow = isExpanded ? "" : "hidden";
    });

    // Mobile dropdown toggles
    const mobileDropdowns = document.querySelectorAll("[data-mobile-dropdown]");
    mobileDropdowns.forEach(function (toggle) {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        const content = toggle.nextElementSibling;
        const isExpanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", !isExpanded);
        toggle.classList.toggle("active");
        if (content) {
          content.classList.toggle("active");
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !mobileMenu.contains(e.target) &&
        !hamburgerBtn.contains(e.target) &&
        mobileMenu.classList.contains("active")
      ) {
        hamburgerBtn.setAttribute("aria-expanded", "false");
        hamburgerBtn.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // ===================================
  // SCROLL ANIMATIONS
  // ===================================
  const animateOnScroll = function () {
    const elements = document.querySelectorAll("[data-animate]");

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  };

  // ===================================
  // SMOOTH SCROLLING
  // ===================================
  const smoothScroll = function () {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        const href = link.getAttribute("href");

        // Skip if it's just "#"
        if (href === "#") return;

        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();
          const headerHeight =
            document.querySelector(".header")?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          // Close mobile menu if open
          if (mobileMenu && mobileMenu.classList.contains("active")) {
            hamburgerBtn.setAttribute("aria-expanded", "false");
            hamburgerBtn.classList.remove("active");
            mobileMenu.classList.remove("active");
            document.body.style.overflow = "";
          }
        }
      });
    });
  };

  // ===================================
  // FORM VALIDATION & SUBMISSION
  // ===================================
  const form = document.getElementById("colo-form");
  const submitBtn = document.getElementById("submit-btn");

  if (form && submitBtn) {
    // Validation functions
    const validators = {
      emri: function (value) {
        if (!value || value.trim().length < 3) {
          return "Emri duhet të ketë së paku 3 karaktere";
        }
        if (!/^[a-zA-ZëËçÇ\s]+$/.test(value)) {
          return "Emri duhet të përmbajë vetëm shkronja";
        }
        return null;
      },

      telefoni: function (value) {
        if (!value || value.trim().length === 0) {
          return "Telefoni është i detyrueshëm";
        }
        const phoneRegex = /^[+]?[\d\s()-]{8,}$/;
        if (!phoneRegex.test(value)) {
          return "Numri i telefonit nuk është valid";
        }
        return null;
      },

      email: function (value) {
        if (!value || value.trim().length === 0) {
          return "Email është i detyrueshëm";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Email nuk është valid";
        }
        return null;
      },

      kompania: function (value) {
        if (!value || value.trim().length < 2) {
          return "Emri i kompanisë është i detyrueshëm";
        }
        return null;
      },

      paketa: function (value) {
        if (!value || value === "") {
          return "Zgjidh një paketë";
        }
        return null;
      },
    };

    // Show error
    const showError = function (fieldId, message) {
      const field = document.getElementById(fieldId);
      const errorSpan = document.getElementById(fieldId + "-error");
      const formGroup = field.closest(".form-group");

      if (formGroup) formGroup.classList.add("error");
      if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.display = "block";
      }
    };

    // Clear error
    const clearError = function (fieldId) {
      const field = document.getElementById(fieldId);
      const errorSpan = document.getElementById(fieldId + "-error");
      const formGroup = field.closest(".form-group");

      if (formGroup) formGroup.classList.remove("error");
      if (errorSpan) {
        errorSpan.textContent = "";
        errorSpan.style.display = "none";
      }
    };

    // Validate field
    const validateField = function (fieldId) {
      const field = document.getElementById(fieldId);
      if (!field) return true;

      const value = field.value;
      const validator = validators[fieldId];

      if (validator) {
        const error = validator(value);
        if (error) {
          showError(fieldId, error);
          return false;
        } else {
          clearError(fieldId);
          return true;
        }
      }

      return true;
    };

    // Real-time validation
    Object.keys(validators).forEach(function (fieldId) {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener("blur", function () {
          validateField(fieldId);
        });

        field.addEventListener("input", function () {
          const formGroup = field.closest(".form-group");
          if (formGroup && formGroup.classList.contains("error")) {
            validateField(fieldId);
          }
        });
      }
    });

    // Form submission
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validate all fields
      let isValid = true;
      Object.keys(validators).forEach(function (fieldId) {
        if (!validateField(fieldId)) {
          isValid = false;
        }
      });

      // Check privacy checkbox
      const privacyCheckbox = document.getElementById("privacy");
      if (privacyCheckbox && !privacyCheckbox.checked) {
        if (window.showToast) {
          window.showToast("Duhet të pranosh kushtet e përdorimit", "error");
        } else {
          alert("Duhet të pranosh kushtet e përdorimit");
        }
        isValid = false;
      }

      if (!isValid) {
        // Scroll to first error
        const firstError = form.querySelector(".form-group.error");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      // Show loading state
      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector(".btn-text");
      const btnLoader = submitBtn.querySelector(".btn-loader");
      if (btnText) btnText.style.display = "none";
      if (btnLoader) btnLoader.style.display = "flex";

      // Collect form data
      const formData = {
        emri: document.getElementById("emri").value,
        telefoni: document.getElementById("telefoni").value,
        email: document.getElementById("email").value,
        kompania: document.getElementById("kompania").value,
        paketa: document.getElementById("paketa").value,
        mesazhi: document.getElementById("mesazhi").value,
        timestamp: new Date().toISOString(),
      };

      // Simulate API call (replace with actual endpoint)
      setTimeout(function () {
        console.log("Form submitted:", formData);

        // Show success message
        if (window.showToast) {
          window.showToast(
            "Kërkesa u dërgua me sukses! Do të kontaktoheni brenda 24 orëve.",
            "success"
          );
        } else {
          alert(
            "Kërkesa u dërgua me sukses! Do të kontaktoheni brenda 24 orëve."
          );
        }

        // Reset form
        form.reset();

        // Reset button state
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = "inline";
        if (btnLoader) btnLoader.style.display = "none";

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 2000);
    });
  }

  // ===================================
  // PRICING TABLE INTERACTIONS
  // ===================================
  const highlightPackage = function () {
    const tableRows = document.querySelectorAll(".pricing-table tbody tr");

    tableRows.forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        const cells = row.querySelectorAll("td");
        cells.forEach(function (cell) {
          if (!cell.classList.contains("featured")) {
            cell.style.background = "rgba(255, 255, 255, 0.03)";
          }
        });
      });

      row.addEventListener("mouseleave", function () {
        const cells = row.querySelectorAll("td");
        cells.forEach(function (cell) {
          if (!cell.classList.contains("featured")) {
            cell.style.background = "";
          }
        });
      });
    });
  };

  // ===================================
  // PACKAGE SELECTOR
  // ===================================
  const packageSelector = document.getElementById("paketa");
  if (packageSelector) {
    // Auto-scroll to form when package is selected
    packageSelector.addEventListener("change", function () {
      if (this.value) {
        const messageField = document.getElementById("mesazhi");
        if (messageField && this.value !== "custom") {
          // Auto-fill technical details based on selected package
          const packages = {
            "1U": "Jam i interesuar për paketen Start (1U):\n• 1U Rack Space\n• 1A @230V\n• 1Gbps Uplink\n• /30 (2 IP)",
            "2U": "Jam i interesuar për paketen Pro (2U):\n• 2U Rack Space\n• 2A @230V\n• 1Gbps Uplink\n• /29 (6 IP)",
            "4U": "Jam i interesuar për paketen Grow (4U):\n• 4U Rack Space\n• 4A @230V\n• 10Gbps Uplink\n• /28 (14 IP)\n• BGP Routing",
            "20U":
              "Jam i interesuar për paketen Cabinet Half (20U):\n• 20U Rack Space\n• 10A @230V\n• 10Gbps Uplink\n• /27 (30 IP)\n• BGP Routing",
            "42U":
              "Jam i interesuar për paketen Full Cabinet (42U):\n• 42U Rack Space\n• 16A @230V\n• 2×10Gbps Uplink\n• /26 (62 IP)\n• BGP Routing",
          };

          if (packages[this.value]) {
            messageField.value = packages[this.value];
          }
        }
      }
    });
  }

  // ===================================
  // INITIALIZE
  // ===================================
  const init = function () {
    animateOnScroll();
    smoothScroll();
    highlightPackage();
    console.log("Colocation page initialized successfully");
  };

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
