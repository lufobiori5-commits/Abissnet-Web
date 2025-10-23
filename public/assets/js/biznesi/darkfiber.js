// ==========================================
// DARK FIBER PAGE ENHANCEMENTS - FIXED
// ==========================================

(function () {
  "use strict";

  // Scroll-triggered animations (FIXED)
  function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!("IntersectionObserver" in window)) {
      console.log("IntersectionObserver not supported, skipping animations");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
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

    // Only hide elements that are NOT already in viewport
    document
      .querySelectorAll(".feature-item, .comparison-table, .pricing-notes")
      .forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        // Only animate if element is BELOW the viewport
        if (!isInViewport) {
          el.style.opacity = "0";
          el.style.transform = "translateY(30px)";
        } else {
          // Already visible, just add visible class
          el.classList.add("visible");
        }

        el.style.transition = "all 0.6s ease-out";
        observer.observe(el);
      });
  }

  // Form handling (IMPROVED ERROR HANDLING)
  function initForm() {
    const form = document.getElementById("darkfiber-form");
    if (!form) {
      console.log("Form not found on this page");
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Validation
      if (!data.emri || !data.telefoni || !data.kompania || !data.kilometra) {
        if (typeof showToast === "function") {
          showToast("Të gjitha fushat me * janë të detyrueshme!", "error");
        } else {
          alert("Të gjitha fushat me * janë të detyrueshme!");
        }
        return;
      }

      // Phone validation (Albanian format)
      const phoneRegex = /^(\+355|0)?[6-9]\d{8}$/;
      if (!phoneRegex.test(data.telefoni.replace(/\s/g, ""))) {
        if (typeof showToast === "function") {
          showToast("Numri i telefonit nuk është valid!", "error");
        } else {
          alert("Numri i telefonit nuk është valid!");
        }
        return;
      }

      // Kilometers validation
      if (data.kilometra < 1 || data.kilometra > 20) {
        if (typeof showToast === "function") {
          showToast("Kilometrat duhet të jenë midis 1 dhe 20!", "error");
        } else {
          alert("Kilometrat duhet të jenë midis 1 dhe 20!");
        }
        return;
      }

      // Simulate API call
      const submitBtn = form.querySelector(".form-submit-btn");
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Duke dërguar...";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";

      try {
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/dark-fiber-request', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (typeof showToast === "function") {
          showToast(
            "✅ Kërkesa u dërgua me sukses! Do t'ju kontaktojmë brenda 24 orëve.",
            "success",
            5000
          );
        } else {
          alert(
            "Kërkesa u dërgua me sukses! Do t'ju kontaktojmë brenda 24 orëve."
          );
        }

        form.reset();
      } catch (error) {
        console.error("Form submission error:", error);
        if (typeof showToast === "function") {
          showToast("❌ Dështoi dërgimi. Provoni përsëri.", "error");
        } else {
          alert("Dështoi dërgimi. Provoni përsëri.");
        }
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
      }
    });
  }

  // Smooth scroll to pricing
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");

        // Ignore empty hash
        if (href === "#" || href === "#!") return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const headerOffset = 100; // Account for fixed header
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // Animated counter for stats (IMPROVED)
  function animateStats() {
    const statNumbers = document.querySelectorAll(".stat-number");

    if (!statNumbers.length) {
      console.log("No stat numbers found");
      return;
    }

    // Check if IntersectionObserver is supported
    if (!("IntersectionObserver" in window)) {
      console.log("IntersectionObserver not supported for stat animations");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const text = target.textContent.trim();

            // Check if it contains a number
            const match = text.match(/\d+/);
            if (match) {
              const finalValue = parseInt(match[0]);
              const hasPercent = text.includes("%");

              animateValue(target, 0, finalValue, 1000, hasPercent);
            }

            observer.unobserve(target);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    statNumbers.forEach((stat) => observer.observe(stat));
  }

  function animateValue(element, start, end, duration, hasPercent = false) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    const originalText = element.textContent;

    const timer = setInterval(() => {
      current += increment;

      if (current >= end) {
        current = end;
        clearInterval(timer);
        // Restore original text to preserve formatting
        element.textContent = originalText;
      } else {
        const value = Math.floor(current);
        element.textContent = hasPercent ? `${value}%` : value;
      }
    }, 16);
  }

  // Add visible class for CSS animations
  function addVisibleClass() {
    const style = document.createElement("style");
    style.textContent = `
      .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize everything
  function init() {
    console.log("🌐 Dark Fiber page initializing...");

    // Add CSS for visible class
    addVisibleClass();

    // Initialize features
    initScrollAnimations();
    initForm();
    initSmoothScroll();
    animateStats();

    console.log("✅ Dark Fiber page ready!");
  }

  // Smart initialization
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
