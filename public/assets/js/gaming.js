// ========================================
// GAMING PAGE ENHANCEMENTS
// ========================================

(function () {
  "use strict";

  // Animate platform cards on scroll
  function initPlatformCards() {
    const platformCards = document.querySelectorAll(".platform-card");
    if (!platformCards.length) return;

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

    platformCards.forEach((card) => observer.observe(card));
  }

  // Animate ping monitor
  function initPingMonitor() {
    const pingNumber = document.querySelector(".ping-number");
    if (!pingNumber) return;

    // Simulate varying ping
    setInterval(() => {
      const newPing = Math.floor(Math.random() * 3) + 3; // 3-5ms
      animateValue(pingNumber, parseInt(pingNumber.textContent), newPing, 500);
    }, 3000);
  }

  // Animate number change
  function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (
        (increment > 0 && current >= end) ||
        (increment < 0 && current <= end)
      ) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }

  // Add hover effect to game features
  function initGameFeatures() {
    const features = document.querySelectorAll(".game-features li");
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
    console.log("🎮 Gaming page initializing...");
    initPlatformCards();
    initPingMonitor();
    initGameFeatures();
    console.log("✅ Gaming page initialized!");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
