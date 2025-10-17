// ========== UTILITY FUNCTIONS ==========
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ========== TOAST NOTIFICATION SYSTEM ==========
function showToast(message, type = "success", duration = 3000) {
  const existingToast = document.querySelector(".toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${
        type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"
      }</span>
      <span class="toast-message">${message}</span>
    </div>
    <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
  `;

  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, duration);

  // Click to dismiss
  toast.addEventListener("click", () => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  });
}

// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  const href = anchor.getAttribute("href");
  if (!href || href === "#") return;

  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ========== SCROLL ANIMATIONS ==========
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".feature-card, .package-card").forEach((el) => {
  observer.observe(el);
});

// ========== OFFER BANNER CAROUSEL ==========
let currentSlide = 0;
const slides = document.querySelectorAll(".offer-banner");
const totalSlides = slides.length;

function showNextSlide() {
  if (slides.length === 0) return;
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % totalSlides;
  slides[currentSlide].classList.add("active");
}

if (slides.length > 0) {
  setInterval(showNextSlide, 3000);
}

// ========== NEWSLETTER FORM ==========
const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput?.value.trim();
    const submitBtn = this.querySelector('button[type="submit"]');

    if (!email) {
      showToast("Ju lutem shkruani email-in tuaj.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showToast("Ju lutem shkruani një email valid.", "error");
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Duke dërguar...";
    submitBtn.disabled = true;

    setTimeout(() => {
      showToast("Faleminderit për regjistrimin! 🎉", "success");
      emailInput.value = "";
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1000);
  });
}

// ========== PACKAGE CARD INTERACTIONS ==========
document.querySelectorAll(".package-card").forEach((card) => {
  card.addEventListener("click", function () {
    document
      .querySelectorAll(".package-card")
      .forEach((c) => c.classList.remove("active"));
    this.classList.add("active");

    const speedEl = this.querySelector(".package-speed");
    const speed = speedEl?.textContent.trim() || "";

    showToast(`Paketa ${speed} është zgjedhur! ✓`, "success");
  });
});

// ========== CONTACT FORM ==========
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const phone = document.getElementById("phone")?.value.trim() || "";
    const city = document.getElementById("city")?.value.trim() || "";
    const subject = document.getElementById("subject")?.value.trim() || "";
    const clientStatus = document.getElementById("client-status")?.value || "";
    const message = document.getElementById("message")?.value.trim() || "";
    const submitBtn = this.querySelector('button[type="submit"]');

    // Validation
    if (!name || !email || !subject || !clientStatus || !message) {
      showToast("Të gjitha fushat me * janë të detyrueshme!", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showToast("Ju lutem shkruani një email valid!", "error");
      return;
    }

    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Duke dërguar...";
    submitBtn.disabled = true;

    // Simulate API call (replace with actual API endpoint)
    setTimeout(() => {
      showToast(
        "Mesazhi juaj u dërgua me sukses! Ne do t'ju kontaktojmë së shpejti. ✓",
        "success"
      );

      // Reset form
      this.reset();

      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });

  // Real-time validation
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      if (this.value.trim() && !isValidEmail(this.value.trim())) {
        this.classList.add("error");
        this.classList.remove("success");
      } else if (this.value.trim()) {
        this.classList.add("success");
        this.classList.remove("error");
      }
    });
  }
}

// ========== HEADER SCROLL EFFECT ==========
let lastScroll = 0;
const header = document.querySelector(".header");

window.addEventListener(
  "scroll",
  debounce(() => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  }, 10)
);

// ========== HAMBURGER MENU FUNCTIONALITY ==========
function initHamburgerMenu() {
  const hamburger = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!hamburger || !mobileMenu) return;

  // Toggle menu
  hamburger.addEventListener("click", function () {
    const isActive = this.classList.contains("active");

    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  function openMenu() {
    hamburger.classList.add("active");
    mobileMenu.classList.add("active");
    document.body.classList.add("menu-open");
    hamburger.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
    document.body.classList.remove("menu-open");
    hamburger.setAttribute("aria-expanded", "false");
  }

  // Close menu when clicking outside
  mobileMenu.addEventListener("click", function (e) {
    if (e.target === mobileMenu) {
      closeMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
      closeMenu();
    }
  });

  // Close menu when clicking on a link
  const mobileLinks = mobileMenu.querySelectorAll("a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Mobile dropdown toggle
  const mobileDropdowns = document.querySelectorAll("[data-mobile-dropdown]");
  mobileDropdowns.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const isActive = this.classList.contains("active");
      const content = this.nextElementSibling;

      // Close all other dropdowns
      mobileDropdowns.forEach((t) => {
        if (t !== this) {
          t.classList.remove("active");
          t.nextElementSibling.classList.remove("active");
        }
      });

      // Toggle current dropdown
      this.classList.toggle("active");
      content.classList.toggle("active");
    });
  });

  // Close menu on window resize to desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900 && mobileMenu.classList.contains("active")) {
      closeMenu();
    }
  });
}

// ========== DROPDOWN TOGGLE FOR DESKTOP ==========
document.querySelectorAll("[data-dropdown]").forEach((dd) => {
  const btn = dd.querySelector("[data-dropdown-toggle]");
  if (!btn) return;

  function closeAll() {
    document.querySelectorAll("[data-dropdown]").forEach((x) => {
      x.classList.remove("open");
      const b = x.querySelector("[data-dropdown-toggle]");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const toOpen = !dd.classList.contains("open");
    closeAll();
    if (toOpen) {
      dd.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });

  document.addEventListener("click", (e) => {
    if (!dd.contains(e.target)) {
      dd.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dd.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      btn.focus();
    }
  });
});

// ========== BACK TO TOP BUTTON ==========
function initBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");
  if (!backToTopBtn) return;

  // Show/hide button based on scroll position
  function toggleBackToTop() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  }

  // Scroll to top smoothly
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Event listeners
  window.addEventListener("scroll", debounce(toggleBackToTop, 100));
  backToTopBtn.addEventListener("click", scrollToTop);

  // Initial check
  toggleBackToTop();
}

// ========== INITIALIZE ON PAGE LOAD ==========
document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initBackToTop();
  console.log("🚀 Abissnet website initialized!");
});

console.log("🚀 Abissnet website scripts loaded!");
