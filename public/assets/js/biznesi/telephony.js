/**
 * TELEPHONY PAGE - MODERN JAVASCRIPT
 */

(function () {
  "use strict";

  // Mobile Menu
  const hamburgerBtn = document.getElementById("hamburger-btn-tel");
  const mobileMenu = document.getElementById("mobile-menu-tel");

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", function () {
      const isExpanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
      hamburgerBtn.setAttribute("aria-expanded", !isExpanded);
      hamburgerBtn.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      document.body.style.overflow = isExpanded ? "" : "hidden";
    });

    const mobileDropdowns = document.querySelectorAll("[data-mobile-dropdown]");
    mobileDropdowns.forEach(function (toggle) {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        const content = toggle.nextElementSibling;
        toggle.classList.toggle("active");
        if (content) content.classList.toggle("active");
      });
    });

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

  // Scroll Animations
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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  };

  // Smooth Scrolling
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
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
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

  // Form Validation
  const form = document.getElementById("tel-form");
  const submitBtn = document.getElementById("submit-btn");

  if (form && submitBtn) {
    const validators = {
      emri: function (value) {
        if (!value || value.trim().length < 3)
          return "Emri duhet të ketë së paku 3 karaktere";
        return null;
      },
      telefoni: function (value) {
        if (!value || value.trim().length === 0)
          return "Telefoni është i detyrueshëm";
        const phoneRegex = /^[+]?[\d\s()-]{8,}$/;
        if (!phoneRegex.test(value)) return "Numri i telefonit nuk është valid";
        return null;
      },
      email: function (value) {
        if (!value || value.trim().length === 0)
          return "Email është i detyrueshëm";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Email nuk është valid";
        return null;
      },
      paketa: function (value) {
        if (!value || value === "") return "Zgjidh një paketë";
        return null;
      },
    };

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

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let isValid = true;
      Object.keys(validators).forEach(function (fieldId) {
        if (!validateField(fieldId)) {
          isValid = false;
        }
      });

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
        const firstError = form.querySelector(".form-group.error");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector(".btn-text");
      const btnLoader = submitBtn.querySelector(".btn-loader");
      if (btnText) btnText.style.display = "none";
      if (btnLoader) btnLoader.style.display = "flex";

      const formData = {
        emri: document.getElementById("emri").value,
        telefoni: document.getElementById("telefoni").value,
        email: document.getElementById("email").value,
        paketa: document.getElementById("paketa").value,
        mesazhi: document.getElementById("mesazhi").value,
        timestamp: new Date().toISOString(),
      };

      setTimeout(function () {
        console.log("Form submitted:", formData);
        if (window.showToast) {
          window.showToast(
            "Kërkesa u dërgua me sukses! Do të kontaktoheni brenda 24 orëve.",
            "success"
          );
        } else {
          alert("Kërkesa u dërgua me sukses!");
        }
        form.reset();
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = "inline";
        if (btnLoader) btnLoader.style.display = "none";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 2000);
    });
  }

  // Initialize
  const init = function () {
    animateOnScroll();
    smoothScroll();
    console.log("Telephony page initialized successfully");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
