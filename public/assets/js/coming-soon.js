// Countdown Timer
function initCountdown() {
  const launchDate = new Date("2025-12-31T23:59:59").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;

    if (distance < 0) {
      document.getElementById("countdown").innerHTML =
        '<h2 style="color: var(--color-primary); font-size: 1.5rem; margin: 0;">Na e arritëm! 🎉</h2>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(
      2,
      "0"
    );
    document.getElementById("minutes").textContent = String(minutes).padStart(
      2,
      "0"
    );
    document.getElementById("seconds").textContent = String(seconds).padStart(
      2,
      "0"
    );
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Notify Form
function initNotifyForm() {
  const form = document.getElementById("notify-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Ju lutem shkruani një email valid!");
      return;
    }

    alert("✅ Faleminderit! Do të njoftoheni së shpejti.");
    this.reset();
  });
}

// Initialize on load
document.addEventListener("DOMContentLoaded", function () {
  initCountdown();
  initNotifyForm();
});
