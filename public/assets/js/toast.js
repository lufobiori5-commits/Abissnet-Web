// ========================================
// UNIFIED TOAST NOTIFICATION SYSTEM
// Use across all Abissnet pages
// ========================================

/**
 * Display a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (default: 5000)
 */
function showToast(message, type = "info", duration = 5000) {
  // Remove any existing toasts
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.style.animation =
      "slideOut 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    setTimeout(() => existingToast.remove(), 400);
  }

  // Create new toast
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "polite");
  toast.setAttribute("aria-atomic", "true");

  // Toast content wrapper
  const toastContent = document.createElement("div");
  toastContent.className = "toast-content";

  // Icon based on type
  const icon = document.createElement("div");
  icon.className = "toast-icon";
  icon.setAttribute("aria-hidden", "true");

  const iconMap = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  icon.textContent = iconMap[type] || iconMap.info;
  toastContent.appendChild(icon);

  // Message
  const messageSpan = document.createElement("span");
  messageSpan.className = "toast-message";
  messageSpan.textContent = message;
  toastContent.appendChild(messageSpan);

  toast.appendChild(toastContent);

  // Progress bar (optional visual feedback)
  const progressBar = document.createElement("div");
  progressBar.className = "toast-progress";
  progressBar.style.animationDuration = `${duration}ms`;
  toast.appendChild(progressBar);

  // Add to DOM
  document.body.appendChild(toast);

  // Trigger animation (after DOM insertion for CSS transition)
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Auto dismiss after duration
  const dismissTimeout = setTimeout(() => {
    dismissToast(toast);
  }, duration);

  // Click to dismiss immediately
  toast.addEventListener("click", () => {
    clearTimeout(dismissTimeout);
    dismissToast(toast);
  });

  // Return toast element (for manual control if needed)
  return toast;
}

/**
 * Dismiss a toast with animation
 * @param {HTMLElement} toast - The toast element to dismiss
 */
function dismissToast(toast) {
  if (!toast || !toast.parentElement) return;

  toast.style.animation =
    "slideOut 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 400);
}

/**
 * Email validation helper
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
  // RFC 5322 simplified regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Export for module systems (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { showToast, dismissToast, isValidEmail };
}
