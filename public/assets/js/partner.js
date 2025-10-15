// ========================================
// PARTNERS PAGE SPECIFIC JAVASCRIPT
// ========================================
// DEPENDENCIES: Requires toast.js to be loaded first
// Uses: showToast(), isValidEmail()
// ========================================

(function () {
  "use strict";

  // ========================================
  // HELPER FUNCTIONS
  // ========================================
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // ========================================
  // REVEAL ON SCROLL
  // ========================================
  function revealOnScroll(selectors) {
    const nodes = selectors.flatMap((s) => $$(s));
    if (!nodes.length) return;

    // If IntersectionObserver unsupported or reduced motion, show immediately
    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || reduceMotion) {
      nodes.forEach((n) => n.classList.add("visible"));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, index * 100);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    nodes.forEach((n) => obs.observe(n));

    // Safety net: if something didn't trigger after a short time, show it
    setTimeout(() => nodes.forEach((n) => n.classList.add("visible")), 800);
  }

  // ========================================
  // PARTNERS CTA BUTTON
  // ========================================
  function initPartnersCTA() {
    const ctaBtn = $(".partners-cta-btn");
    if (!ctaBtn) return;

    ctaBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (typeof showToast === "function") {
        showToast(
          "📋 Formulari i aplikimit do të hapet së shpejti!",
          "info",
          3000
        );
      } else {
        alert("Formulari i aplikimit do të hapet së shpejti!");
      }

      // TODO: Open partner application modal or redirect to form page
      // Example: window.location.href = 'partner-application.html';
    });
  }

  // ========================================
  // DEBOUNCE UTILITY
  // ========================================
  function debounce(fn, delay = 120) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), delay);
    };
  }

  // ========================================
  // INITIALIZATION
  // ========================================
  function init() {
    console.log("🤝 Partners page scripts initializing...");

    // Reveal partner & benefits cards
    revealOnScroll([".partner-card", ".benefit-card"]);

    // Initialize CTA button
    initPartnersCTA();

    console.log("✅ Partners page initialized successfully!");
  }

  // Run init when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
