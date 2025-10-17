// ========================================
// STREAMING PAGE ENHANCEMENTS
// ========================================

(function () {
  "use strict";

  // Animate platform logos on scroll
  function initPlatformLogos() {
    const platformLogos = document.querySelectorAll(".platform-logo");
    if (!platformLogos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
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

    platformLogos.forEach((logo) => observer.observe(logo));
  }

  // Animate benefit cards on scroll
  function initBenefitCards() {
    const benefitCards = document.querySelectorAll(".benefit-card");
    if (!benefitCards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
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

    benefitCards.forEach((card) => observer.observe(card));
  }

  // Animate usage bars
  function initUsageBars() {
    const usageBars = document.querySelectorAll(".usage-visual");
    if (!usageBars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.transition = "width 1s ease-out";
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    usageBars.forEach((bar) => {
      const originalWidth = bar.style.width;
      bar.style.width = "0%";
      observer.observe(bar);

      setTimeout(() => {
        bar.style.width = originalWidth;
      }, 100);
    });
  }

  // Add hover effect to stream features
  function initStreamFeatures() {
    const features = document.querySelectorAll(".stream-features li");
    features.forEach((feature) => {
      feature.addEventListener("mouseenter", function () {
        this.style.transform = "translateX(10px) scale(1.02)";
      });
      feature.addEventListener("mouseleave", function () {
        this.style.transform = "translateX(5px) scale(1)";
      });
    });
  }

  // Initialize on DOM ready
  function init() {
    console.log("📺 Streaming page initializing...");
    initPlatformLogos();
    initBenefitCards();
    initUsageBars();
    initStreamFeatures();
    console.log("✅ Streaming page initialized!");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
