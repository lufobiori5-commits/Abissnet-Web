/**
 * DDOS PROTECTION PAGE - MODERN JAVASCRIPT
 * Features: FAQ accordion, form validation, stats counter, pricing calculator
 */

(function () {
  "use strict";

  // ===================================
  // MOBILE MENU
  // ===================================
  const hamburgerBtn = document.getElementById("hamburger-btn-ddos");
  const mobileMenu = document.getElementById("mobile-menu-ddos");

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
  // STATS COUNTER ANIMATION
  // ===================================
  const animateStats = function () {
    const statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const value = entry.target;
            const target = parseFloat(value.getAttribute("data-count"));

            if (target) {
              let current = 0;
              const increment = target / 50;
              const timer = setInterval(function () {
                current += increment;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }

                // Format the number
                if (value.querySelector("span")) {
                  value.querySelector("span").textContent = Math.floor(current);
                } else {
                  value.textContent =
                    current === 99.99 ? "99.99" : Math.floor(current);
                }
              }, 20);
            }

            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const statValues = document.querySelectorAll(".stat-value[data-count]");
    statValues.forEach(function (stat) {
      statsObserver.observe(stat);
    });
  };

  // ===================================
  // FAQ ACCORDION
  // ===================================
  const initFAQ = function () {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(function (item) {
      const question = item.querySelector(".faq-question");

      if (question) {
        question.addEventListener("click", function () {
          const isActive = item.classList.contains("active");

          // Close all other items
          faqItems.forEach(function (otherItem) {
            if (otherItem !== item) {
              otherItem.classList.remove("active");
            }
          });

          // Toggle current item
          if (isActive) {
            item.classList.remove("active");
          } else {
            item.classList.add("active");
          }
        });
      }
    });
  };

  // ===================================
  // PRICING CALCULATOR
  // ===================================
  const initCalculator = function () {
    const input = document.getElementById("calc-gbps");
    const result = document.getElementById("calc-result");

    if (input && result) {
      const calculatePrice = function (gbps) {
        let pricePerGbps;

        if (gbps === 1) {
          pricePerGbps = 5000;
        } else if (gbps >= 2 && gbps <= 5) {
          pricePerGbps = 4000;
        } else if (gbps >= 6 && gbps <= 10) {
          pricePerGbps = 3500;
        } else if (gbps >= 11 && gbps <= 20) {
          pricePerGbps = 3200;
        } else if (gbps >= 27 && gbps <= 50) {
          pricePerGbps = 2400;
        } else if (gbps > 50) {
          pricePerGbps = 2400; // Same as highest tier
        } else {
          pricePerGbps = 5000; // Default
        }

        return gbps * pricePerGbps;
      };

      const updatePrice = function () {
        const gbps = parseInt(input.value) || 10;
        const total = calculatePrice(gbps);
        result.textContent = total.toLocaleString("sq-AL") + " Lekë/muaj";
      };

      input.addEventListener("input", updatePrice);
      updatePrice(); // Initial calculation
    }
  };

  // ===================================
  // FORM VALIDATION & SUBMISSION
  // ===================================
  const form = document.getElementById("ddos-form");
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

      kapaciteti: function (value) {
        if (!value || value === "") {
          return "Zgjidh kapacitetin e dëshiruar";
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
        kapaciteti: document.getElementById("kapaciteti").value,
        tipiBiznesit: document.getElementById("tipi-biznesit").value,
        mesazhi: document.getElementById("mesazhi").value,
        timestamp: new Date().toISOString(),
      };

      // Simulate API call (replace with actual endpoint)
      setTimeout(function () {
        console.log("Form submitted:", formData);

        // Show success message
        if (window.showToast) {
          window.showToast(
            "Kërkesa u dërgua me sukses! Do të kontaktoheni brenda 24 orëve për një ofertë të personalizuar.",
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
  // INITIALIZE
  // ===================================
  const init = function () {
    animateOnScroll();
    smoothScroll();
    animateStats();
    initFAQ();
    initCalculator();
    console.log("DDoS Protection page initialized successfully");
  };

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
