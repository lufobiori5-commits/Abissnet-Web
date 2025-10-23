/**
 * ==============================================
 * VPS HOSTING - PREMIUM EDITION
 * ==============================================
 *
 * Enhanced JavaScript for VPS Hosting page
 * Features: Smooth scrolling, back-to-top, animations
 *
 * @version 1.0.0
 * @author Abissnet Development Team
 * @date 2025-10-22
 */

(function () {
  "use strict";

  // ==========================================
  // CONFIGURATION
  // ==========================================
  const CONFIG = {
    backToTopThreshold: 300,
    scrollRevealThreshold: 80,
  };

  // ==========================================
  // DOM ELEMENTS
  // ==========================================
  const elements = {
    backToTop: document.getElementById("back-to-top"),
    hamburgerBtn: document.getElementById("hamburger-btn"),
    mobileMenu: document.getElementById("mobile-menu"),
  };

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  function log(message, type = "info") {
    const emoji = {
      info: "ℹ️",
      success: "✅",
      error: "❌",
      warning: "⚠️",
    };
    console.log(`${emoji[type]} [VPS Hosting] ${message}`);
  }

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // ==========================================
  // BACK TO TOP BUTTON
  // ==========================================

  function setupBackToTop() {
    if (!elements.backToTop) return;

    const handleScroll = () => {
      if (window.scrollY > CONFIG.backToTopThreshold) {
        elements.backToTop.classList.add("show");
      } else {
        elements.backToTop.classList.remove("show");
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
  // SMOOTH SCROLLING FOR ANCHOR LINKS
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

    log("Smooth scrolling initialized", "success");
  }

  // ==========================================
  // DROPDOWN MENU
  // ==========================================

  function setupDropdowns() {
    document.querySelectorAll("[data-dropdown]").forEach((dropdown) => {
      const toggle = dropdown.querySelector("[data-dropdown-toggle]");

      if (toggle) {
        toggle.addEventListener("click", function (e) {
          e.stopPropagation();
          dropdown.classList.toggle("open");

          const isOpen = dropdown.classList.contains("open");
          toggle.setAttribute("aria-expanded", isOpen);
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", function (e) {
          if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
          }
        });
      }
    });

    log("Dropdowns initialized", "success");
  }

  // ==========================================
  // MOBILE MENU
  // ==========================================

  function setupMobileMenu() {
    if (!elements.hamburgerBtn || !elements.mobileMenu) return;

    elements.hamburgerBtn.addEventListener("click", function () {
      this.classList.toggle("active");
      elements.mobileMenu.classList.toggle("active");
      document.body.classList.toggle("menu-open");

      const isOpen = this.classList.contains("active");
      this.setAttribute("aria-expanded", isOpen);
    });

    // Mobile dropdown toggles
    const mobileDropdownToggles = elements.mobileMenu.querySelectorAll(
      "[data-mobile-dropdown]"
    );
    mobileDropdownToggles.forEach((toggle) => {
      toggle.addEventListener("click", function () {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        if (content) {
          content.classList.toggle("active");
        }
      });
    });

    log("Mobile menu initialized", "success");
  }

  // ==========================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================

  function setupScrollReveal() {
    if (!("IntersectionObserver" in window)) {
      log("IntersectionObserver not supported", "warning");
      return;
    }

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

    // Animate package cards
    document.querySelectorAll(".package-card").forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      observer.observe(card);
    });

    // Animate feature items
    document.querySelectorAll(".feature-item").forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(30px)";
      item.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      observer.observe(item);
    });

    log("Scroll reveal animations initialized", "success");
  }

  // ==========================================
  // PACKAGE CARD INTERACTIONS
  // ==========================================

  function setupPackageCards() {
    const packageCards = document.querySelectorAll(".package-card");

    packageCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-8px)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0)";
      });
    });

    log("Package card interactions initialized", "success");
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
        this.style.backgroundColor = "rgba(255, 152, 0, 0.05)";
      });

      row.addEventListener("mouseleave", function () {
        this.style.backgroundColor = "";
      });
    });

    log("Table enhancements applied", "success");
  }

  // ==========================================
  // ANALYTICS TRACKING
  // ==========================================

  function setupAnalytics() {
    // Track package button clicks
    document.querySelectorAll(".package-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const packageCard = this.closest(".package-card");
        const packageName =
          packageCard?.querySelector(".package-label")?.textContent;

        log(`Package clicked: ${packageName}`, "info");

        // Google Analytics
        if (typeof gtag !== "undefined") {
          gtag("event", "select_package", {
            event_category: "vps_hosting",
            event_label: packageName,
          });
        }

        // Facebook Pixel
        if (typeof fbq !== "undefined") {
          fbq("track", "AddToCart", {
            content_name: `VPS - ${packageName}`,
            content_category: "hosting",
          });
        }
      });
    });

    // Track CTA button
    const ctaButton = document.querySelector(".cta-button");
    if (ctaButton) {
      ctaButton.addEventListener("click", function () {
        log("CTA clicked: Request Quote", "info");

        if (typeof gtag !== "undefined") {
          gtag("event", "click", {
            event_category: "engagement",
            event_label: "request_quote_vps",
          });
        }
      });
    }

    log("Analytics tracking setup complete", "success");
  }

  // ==========================================
  // SUBNAV ACTIVE STATE
  // ==========================================

  function setupSubnav() {
    const subnavLinks = document.querySelectorAll(".subnav .pill");

    window.addEventListener(
      "scroll",
      debounce(() => {
        let current = "";

        subnavLinks.forEach((link) => {
          const href = link.getAttribute("href");
          if (!href || !href.startsWith("#")) return;

          const section = document.querySelector(href);
          if (section) {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (
              window.scrollY >= sectionTop &&
              window.scrollY < sectionBottom
            ) {
              current = href;
            }
          }
        });

        subnavLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === current) {
            link.classList.add("active");
          }
        });
      }, 100)
    );

    log("Subnav active state tracking initialized", "success");
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
    log("Initializing VPS Hosting Premium...", "info");

    try {
      setupErrorHandling();
      setupDropdowns();
      setupMobileMenu();
      setupBackToTop();
      setupSmoothScrolling();
      setupScrollReveal();
      setupPackageCards();
      enhanceTable();
      setupSubnav();
      setupAnalytics();

      // Add animation styles
      if (!document.getElementById("vps-premium-styles")) {
        const style = document.createElement("style");
        style.id = "vps-premium-styles";
        style.textContent = `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }

      log("VPS Hosting Premium ready! 🚀", "success");
    } catch (error) {
      log(`Initialization error: ${error.message}`, "error");
    }
  }

  // Run initialization when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // ==========================================
  // PUBLIC API
  // ==========================================
  window.VPSHostingPremium = {
    version: "1.0.0",
    config: CONFIG,
  };
})();
