// ========================================
// WORK FROM HOME PAGE ENHANCEMENTS
// ========================================

(function () {
  "use strict";

  // Animate benefit cards on scroll
  function initBenefitCards() {
    const benefitCards = document.querySelectorAll(".wfh-benefit-card");
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

  // Smooth scroll for CTA button
  function initSmoothScroll() {
    const ctaBtn = document.querySelector(".wfh-cta-btn");
    if (!ctaBtn) return;

    ctaBtn.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  }

  // Add parallax effect to hero
  function initParallax() {
    const hero = document.querySelector(".wfh-hero");
    if (!hero) return;

    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const heroHeight = hero.offsetHeight;

      if (scrolled < heroHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - scrolled / heroHeight;
      }
    });
  }

  // Initialize on DOM ready
  function init() {
    console.log("🏠 Work From Home page initializing...");
    initBenefitCards();
    initSmoothScroll();
    // initParallax(); // Uncomment if you want parallax effect

    console.log("✅ Work From Home page initialized!");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
