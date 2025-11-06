(function () {
  "use strict";

  // DOM Elements
  const refCodeEl = document.getElementById("refCode");
  const refLinkEl = document.getElementById("refLink");
  const nominateForm = document.getElementById("nominate-form");

  // Initialize referral code
  const params = new URLSearchParams(window.location.search);
  const saved = localStorage.getItem("abiss_ref_code");
  const initial =
    params.get("ref") ||
    saved ||
    "AB" + Math.random().toString(36).substring(2, 8).toUpperCase();

  refCodeEl.value = initial;

  /**
   * Build referral link
   */
  function buildLink() {
    const code = (refCodeEl.value || "").trim();
    if (!code) {
      refLinkEl.value = "";
      return "";
    }

    const origin =
      window.location.origin ||
      window.location.protocol + "//" + window.location.host;
    const link = origin + "/abonentet.html?ref=" + encodeURIComponent(code);
    refLinkEl.value = link;
    localStorage.setItem("abiss_ref_code", code);
    return link;
  }

  // Initial build
  buildLink();

  // Update on input
  refCodeEl.addEventListener("input", buildLink);

  /**
   * Show toast notification
   */
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type} show`;
    toast.innerHTML = `
            <div class="toast-content">
              <div class="toast-icon">${
                type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"
              }</div>
              <div class="toast-message">${message}</div>
            </div>
            <div class="toast-progress" style="animation-duration: 2.5s;"></div>
          `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  /**
   * Copy link to clipboard
   */
  async function copyLink() {
    const link = buildLink();

    if (!link) {
      showToast("Ju lutem vendosni një kod referimi!", "error");
      refCodeEl.focus();
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      showToast("Linku u kopjua me sukses!");
    } catch (e) {
      // Fallback for older browsers
      refLinkEl.select();
      refLinkEl.setSelectionRange(0, 99999);
      document.execCommand("copy");
      showToast("Linku u kopjua!");
    }
  }

  /**
   * Share via WhatsApp
   */
  function shareWhatsApp() {
    const link = buildLink();

    if (!link) {
      showToast("Ju lutem vendosni një kod referimi!", "error");
      refCodeEl.focus();
      return;
    }

    const text = encodeURIComponent(
      "Përshëndetje! Po të rekomandoj Abissnet - internet fiber i shpejtë dhe i besueshëm. Regjistrohu këtu dhe merr 50% ulje në muajin e parë: " +
        link
    );
    window.open("https://wa.me/?text=" + text, "_blank", "noopener,noreferrer");
  }

  /**
   * Share via Telegram
   */
  function shareTelegram() {
    const link = buildLink();

    if (!link) {
      showToast("Ju lutem vendosni një kod referimi!", "error");
      refCodeEl.focus();
      return;
    }

    const text = encodeURIComponent(
      "Abissnet - Internet Fiber i Shpejtë! Merr 50% ulje:"
    );
    window.open(
      "https://t.me/share/url?url=" +
        encodeURIComponent(link) +
        "&text=" +
        text,
      "_blank",
      "noopener,noreferrer"
    );
  }

  /**
   * Share via Email
   */
  function shareEmail() {
    const link = buildLink();

    if (!link) {
      showToast("Ju lutem vendosni një kod referimi!", "error");
      refCodeEl.focus();
      return;
    }

    const subject = encodeURIComponent("Ftesë për Abissnet - Internet Fiber");
    const body = encodeURIComponent(
      "Përshëndetje!\n\n" +
        "Po të ftoj të bashkohesh me Abissnet - ofruesin më të mirë të internetit fiber në Shqipëri!\n\n" +
        "Nëse regjistrohesh nga ky link, do të marrësh 50% ulje në muajin e parë:\n" +
        link +
        "\n\n" +
        "Përfitimet:\n" +
        "✓ Internet fiber super i shpejtë\n" +
        "✓ 50% ulje në muajin e parë\n" +
        "✓ Mbështetje 24/7\n" +
        "✓ Instalim falas\n\n" +
        "Shihemi online!\n"
    );

    window.location.href = "mailto:?subject=" + subject + "&body=" + body;
  }

  /**
   * Handle nomination form submission
   */
  function handleNominateSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = {
      yourName: document.getElementById("yourName").value.trim(),
      friendName: document.getElementById("friendName").value.trim(),
      friendPhone: document.getElementById("friendPhone").value.trim(),
      city: document.getElementById("city").value.trim(),
      notes: document.getElementById("notes").value.trim(),
      referralCode: refCodeEl.value.trim(),
    };

    // Basic validation
    if (!formData.yourName || !formData.friendName || !formData.friendPhone) {
      showToast("Ju lutem plotësoni të gjitha fushat e detyrueshme!", "error");
      return;
    }

    // Phone validation
    const phoneRegex = /^[+]?[0-9]{9,15}$/;
    if (!phoneRegex.test(formData.friendPhone.replace(/\s/g, ""))) {
      showToast("Numri i telefonit nuk është valid!", "error");
      document.getElementById("friendPhone").focus();
      return;
    }

    // TODO: Send to backend API
    console.log("Nomination data:", formData);

    // Show success message
    showToast(
      "Nomimi u dërgua me sukses! Do të kontaktojmë mikun tuaj së shpejti."
    );

    // Reset form
    nominateForm.reset();
  }

  // Event Listeners
  document.getElementById("btnCopy").addEventListener("click", copyLink);
  document.getElementById("btnWa").addEventListener("click", shareWhatsApp);
  document.getElementById("btnTg").addEventListener("click", shareTelegram);
  document.getElementById("btnMail").addEventListener("click", shareEmail);
  nominateForm.addEventListener("submit", handleNominateSubmit);

  // Keyboard accessibility
  [
    document.getElementById("btnCopy"),
    document.getElementById("btnWa"),
    document.getElementById("btnTg"),
    document.getElementById("btnMail"),
  ].forEach((btn) => {
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });
})();
