// ========================================
// HOME INTERNET PAGE
// ========================================

(function () {
  "use strict";

  // Handle form submission
  function initApplicationForm() {
    const form = document.getElementById("home-internet-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const emri = document.getElementById("emri")?.value.trim();
      const telefoni = document.getElementById("telefoni")?.value.trim();
      const adresa = document.getElementById("adresa")?.value.trim();
      const paketa = document.getElementById("paketa")?.value;

      // Validation
      if (!emri || !telefoni || !adresa) {
        if (typeof showToast === "function") {
          showToast(
            "Të gjitha fushat e shënuara me * janë të detyrueshme!",
            "error"
          );
        }
        return;
      }

      // Simulate submission
      if (typeof showToast === "function") {
        showToast(
          `✅ Kërkesa u dërgua me sukses! Do të kontaktohesh brenda 24 orëve për paketën ${paketa} Mbps.`,
          "success",
          4000
        );
      }

      // Reset form
      this.reset();

      // TODO: Send to backend
      // fetch('/api/applications', { method: 'POST', body: JSON.stringify({ emri, telefoni, adresa, paketa }) })
    });
  }

  // Handle newsletter form
  function initNewsletterForm() {
    const form = document.getElementById("footer-newsletter");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = this.querySelector('input[type="email"]').value.trim();

      if (typeof showToast === "function") {
        showToast("✅ Faleminderit për abonimin!", "success");
      }

      this.reset();
    });
  }

  // Initialize on load
  function init() {
    console.log("🏠 Home Internet page initializing...");
    initApplicationForm();
    initNewsletterForm();
    console.log("✅ Home Internet page initialized!");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
