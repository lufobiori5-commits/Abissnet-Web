/**
 * ==============================================
 * WEBSITE HOSTING - PREMIUM EDITION
 * ==============================================
 *
 * Enhanced JavaScript with premium features
 * Features: Form validation, animations, back-to-top, analytics
 *
 * @version 3.0.0 (Premium Edition)
 * @author Abissnet Development Team
 * @date 2025-10-22
 */

(function () {
  "use strict";

  // ==========================================
  // CONFIGURATION
  // ==========================================
  const CONFIG = {
    apiEndpoint: "/api/website-hosting-request",
    phonePattern: /^(\+355|0)(6[0-9]|67|68|69)\d{7}$/,
    minNameLength: 3,
    minCompanyLength: 3,
    debounceDelay: 300,
    animationDuration: 600,
    backToTopThreshold: 300,
  };

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const state = {
    isSubmitting: false,
    formTouched: false,
    selectedPackage: "elite",
    scrollY: 0,
  };

  // ==========================================
  // DOM ELEMENTS
  // ==========================================
  const elements = {
    form: document.getElementById("websitehosting-form"),
    emri: document.getElementById("emri"),
    telefoni: document.getElementById("telefoni"),
    kompania: document.getElementById("kompania"),
    paketa: document.getElementById("paketa"),
    mesazhi: document.getElementById("mesazhi"),
    backToTop: document.getElementById("back-to-top"),
  };

  if (elements.form) {
    elements.submitBtn = elements.form.querySelector('button[type="submit"]');
  }

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  function log(message, type = "info") {
    const emoji = {
      info: "ℹ️",
      success: "✅",
      error: "❌",
      warning: "⚠️",
      debug: "🔧",
    };
    console.log(`${emoji[type]} [Website Hosting Premium] ${message}`);
  }

  // ==========================================
  // VALIDATION FUNCTIONS
  // ==========================================

  function validatePhone(phone) {
    const cleaned = phone.replace(/\s+/g, "");
    return CONFIG.phonePattern.test(cleaned);
  }

  function validateName(name) {
    const trimmed = name.trim();
    return (
      trimmed.length >= CONFIG.minNameLength &&
      /^[A-Za-zÇçËëÀ-ÿ\s'-]+$/.test(trimmed)
    );
  }

  function validateCompany(company) {
    return company.trim().length >= CONFIG.minCompanyLength;
  }

  function showError(field, message) {
    if (!field) return;

    const formGroup = field.closest(".form-group");
    if (!formGroup) return;

    clearError(field);

    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.style.cssText = `
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      animation: fadeInDown 0.2s ease-out;
    `;
    errorDiv.textContent = message;

    formGroup.appendChild(errorDiv);
    field.style.borderColor = "#ef4444";
    field.setAttribute("aria-invalid", "true");
  }

  function clearError(field) {
    if (!field) return;

    const formGroup = field.closest(".form-group");
    if (!formGroup) return;

    const existingError = formGroup.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }

    field.style.borderColor = "";
    field.removeAttribute("aria-invalid");
  }

  function validateForm() {
    let isValid = true;

    if (!validateName(elements.emri.value)) {
      showError(elements.emri, "Ju lutem shkruani emrin dhe mbiemrin e plotë.");
      isValid = false;
    } else {
      clearError(elements.emri);
    }

    if (!validatePhone(elements.telefoni.value)) {
      showError(
        elements.telefoni,
        "Numri i telefonit duhet të jetë në formatin shqiptar."
      );
      isValid = false;
    } else {
      clearError(elements.telefoni);
    }

    if (!validateCompany(elements.kompania.value)) {
      showError(
        elements.kompania,
        "Emri i kompanisë duhet të ketë të paktën 3 karaktere."
      );
      isValid = false;
    } else {
      clearError(elements.kompania);
    }

    return isValid;
  }

  // ==========================================
  // PHONE FORMATTING
  // ==========================================

  function formatPhoneNumber(value) {
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("355")) {
      digits = digits.slice(3);
      let formatted = "+355";
      if (digits.length > 0) formatted += " " + digits.slice(0, 2);
      if (digits.length > 2) formatted += " " + digits.slice(2, 5);
      if (digits.length > 5) formatted += " " + digits.slice(5, 9);
      return formatted;
    }

    if (digits.startsWith("0")) {
      let formatted = digits.slice(0, 3);
      if (digits.length > 3) formatted += " " + digits.slice(3, 6);
      if (digits.length > 6) formatted += " " + digits.slice(6, 10);
      return formatted;
    }

    return value;
  }

  function setupPhoneFormatting() {
    if (!elements.telefoni) return;

    elements.telefoni.addEventListener("input", function (e) {
      const cursorPos = e.target.selectionStart;
      const oldValue = e.target.value;
      const newValue = formatPhoneNumber(oldValue);

      e.target.value = newValue;

      if (cursorPos !== null) {
        const diff = newValue.length - oldValue.length;
        e.target.setSelectionRange(cursorPos + diff, cursorPos + diff);
      }
    });
  }

  // ==========================================
  // REAL-TIME VALIDATION
  // ==========================================

  function setupRealtimeValidation() {
    if (elements.emri) {
      elements.emri.addEventListener("blur", function () {
        if (this.value.trim() && !validateName(this.value)) {
          showError(this, "Emri duhet të përmbajë vetëm shkronja.");
        } else if (this.value.trim()) {
          clearError(this);
        }
      });

      elements.emri.addEventListener("input", function () {
        if (state.formTouched) clearError(this);
      });
    }

    if (elements.telefoni) {
      const validatePhoneDebounced = debounce(function () {
        const value = elements.telefoni.value.trim();
        if (value && !validatePhone(value)) {
          showError(elements.telefoni, "Format i pavlefshëm telefoni.");
        } else if (value) {
          clearError(elements.telefoni);
        }
      }, CONFIG.debounceDelay);

      elements.telefoni.addEventListener("input", validatePhoneDebounced);
      elements.telefoni.addEventListener("blur", validatePhoneDebounced);
    }

    if (elements.kompania) {
      elements.kompania.addEventListener("blur", function () {
        if (this.value.trim() && !validateCompany(this.value)) {
          showError(this, "Emri i kompanisë është shumë i shkurtër.");
        } else if (this.value.trim()) {
          clearError(this);
        }
      });
    }
  }

  // ==========================================
  // FORM SUBMISSION
  // ==========================================

  function setLoadingState(isLoading) {
    if (!elements.submitBtn) return;

    state.isSubmitting = isLoading;

    if (isLoading) {
      elements.submitBtn.disabled = true;
      elements.submitBtn.dataset.originalText = elements.submitBtn.innerHTML;
      elements.submitBtn.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
          <span style="display: inline-block; width: 16px; height: 16px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite;"></span>
          Duke dërguar...
        </span>
      `;
      elements.submitBtn.style.opacity = "0.7";
    } else {
      elements.submitBtn.disabled = false;
      elements.submitBtn.innerHTML =
        elements.submitBtn.dataset.originalText ||
        "<span>Dërgo Kërkesën</span>";
      elements.submitBtn.style.opacity = "1";
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    state.formTouched = true;

    if (!validateForm()) {
      if (window.showToast) {
        window.showToast(
          "Ju lutem plotësoni të gjitha fushat e detyrueshme në mënyrë korrekte.",
          "error"
        );
      }
      return;
    }

    if (state.isSubmitting) return;

    const formData = {
      emri: elements.emri.value.trim(),
      telefoni: elements.telefoni.value.trim(),
      kompania: elements.kompania.value.trim(),
      paketa: elements.paketa.value,
      mesazhi: elements.mesazhi.value.trim(),
      timestamp: new Date().toISOString(),
      page: "website-hosting",
    };

    log("Submitting form...", "info");
    setLoadingState(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      log("Form submitted successfully", "success");

      if (window.showToast) {
        window.showToast(
          `Kërkesa juaj për ${getPackageName(
            formData.paketa
          )} u dërgua me sukses! Do t'ju kontaktojmë së shpejti.`,
          "success"
        );
      }

      elements.form.reset();
      clearAllErrors();
      state.formTouched = false;

      trackFormSubmission(formData);
      console.log("📧 Request submitted:", formData);
    } catch (error) {
      log(`Error: ${error.message}`, "error");

      if (window.showToast) {
        window.showToast(
          "Ndodhi një gabim. Ju lutem provoni përsëri.",
          "error"
        );
      }
    } finally {
      setLoadingState(false);
    }
  }

  function getPackageName(packageId) {
    const packages = {
      elite: "Abissnet ELITE",
      nexus: "Abissnet Nexus",
      matrix: "Abissnet Matrix",
      omnia: "Abissnet Omnia",
    };
    return packages[packageId] || packageId;
  }

  function clearAllErrors() {
    Object.values(elements).forEach((element) => {
      if (element && element.nodeType === 1) {
        clearError(element);
      }
    });
  }

  // ==========================================
  // SCROLL ANIMATIONS
  // ==========================================

  function initScrollAnimations() {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    document.querySelectorAll(".feature-item").forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(30px)";
      item.style.transition = `all ${CONFIG.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      observer.observe(item);
    });
  }

  // ==========================================
  // BACK TO TOP BUTTON
  // ==========================================

  function setupBackToTop() {
    if (!elements.backToTop) return;

    const handleScroll = () => {
      state.scrollY = window.scrollY;

      if (state.scrollY > CONFIG.backToTopThreshold) {
        elements.backToTop.classList.add("visible");
      } else {
        elements.backToTop.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", debounce(handleScroll, 100));

    elements.backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    log("Back to top button initialized", "success");
  }

  // ==========================================
  // SMOOTH SCROLLING
  // ==========================================

  function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#") return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight =
            document.querySelector(".header")?.offsetHeight || 0;
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight -
            20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // ==========================================
  // PACKAGE SELECTION
  // ==========================================

  function setupPackageSelection() {
    if (!elements.paketa) return;

    elements.paketa.addEventListener("change", function () {
      state.selectedPackage = this.value;

      this.style.borderColor = "#3b82f6";
      setTimeout(() => {
        this.style.borderColor = "";
      }, 500);

      trackPackageSelection(this.value);
    });
  }

  // ==========================================
  // TABLE ENHANCEMENTS
  // ==========================================

  function enhanceTable() {
    const table = document.querySelector(".comparison-table");
    if (!table) return;

    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      row.style.transition = "background-color 0.2s ease";

      row.addEventListener("mouseenter", function () {
        this.style.backgroundColor = "rgba(59, 130, 246, 0.08)";
      });

      row.addEventListener("mouseleave", function () {
        this.style.backgroundColor = "";
      });
    });
  }

  // ==========================================
  // ANALYTICS
  // ==========================================

  function trackPackageSelection(packageId) {
    log(`Analytics: Package selected - ${packageId}`, "debug");

    if (typeof gtag !== "undefined") {
      gtag("event", "select_package", {
        event_category: "website_hosting",
        event_label: packageId,
      });
    }

    if (typeof fbq !== "undefined") {
      fbq("track", "AddToCart", {
        content_name: `Website Hosting - ${getPackageName(packageId)}`,
      });
    }
  }

  function trackFormSubmission(formData) {
    log("Analytics: Form submitted", "debug");

    if (typeof gtag !== "undefined") {
      gtag("event", "generate_lead", {
        event_category: "website_hosting",
        event_label: formData.paketa,
      });
    }

    if (typeof fbq !== "undefined") {
      fbq("track", "Lead");
    }
  }

  // ==========================================
  // ERROR HANDLING
  // ==========================================

  function setupErrorHandling() {
    window.addEventListener("error", function (e) {
      log(`Global error: ${e.message}`, "error");
      e.preventDefault();
    });

    window.addEventListener("unhandledrejection", function (e) {
      log(`Unhandled rejection: ${e.reason}`, "error");
      e.preventDefault();
    });
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  function init() {
    log("Initializing Website Hosting Premium...", "info");

    if (!elements.form) {
      log("Form not found", "warning");
      return;
    }

    try {
      setupErrorHandling();
      setupPhoneFormatting();
      setupRealtimeValidation();
      setupPackageSelection();
      setupSmoothScrolling();
      setupBackToTop();
      initScrollAnimations();
      enhanceTable();

      elements.form.addEventListener("submit", handleFormSubmit);

      // Add CSS animations
      if (!document.getElementById("premium-styles")) {
        const style = document.createElement("style");
        style.id = "premium-styles";
        style.textContent = `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `;
        document.head.appendChild(style);
      }

      log("Website Hosting Premium ready! 🚀", "success");
    } catch (error) {
      log(`Initialization error: ${error.message}`, "error");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // ==========================================
  // PUBLIC API
  // ==========================================
  window.WebsiteHostingPremium = {
    validatePhone,
    validateName,
    validateCompany,
    validateForm,
    getPackageName,
    state,
    version: "3.0.0",
  };
})();
