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

// ========== THEME SWITCHER ==========
const THEME_KEY = "abissnet-theme";
const THEMES = {
  DARK: "dark",
  LIGHT: "light",
};

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || THEMES.DARK;
}

function setStoredTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

function getCurrentTheme() {
  const styleLink = document.querySelector('link[href*="style"]');
  if (!styleLink) return THEMES.DARK;
  return styleLink.href.includes("style-light.css")
    ? THEMES.LIGHT
    : THEMES.DARK;
}

function applyTheme(theme) {
  const head = document.head;
  const existingLink = document.querySelector('link[href*="style"]');

  if (!existingLink) {
    console.error("No stylesheet link found!");
    return;
  }

  const newHref =
    theme === THEMES.LIGHT
      ? existingLink.href.replace("style.css", "style-light.css")
      : existingLink.href.replace("style-light.css", "style.css");

  existingLink.href = newHref;
  setStoredTheme(theme);

  // Update theme toggle button icon if it exists
  updateThemeToggleIcon(theme);

  showToast(
    theme === THEMES.LIGHT
      ? "🌞 Tema e ndriçuar u aktivizua!"
      : "🌙 Tema e errët u aktivizua!",
    "info",
    2000
  );
}

function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
  applyTheme(newTheme);
}

function updateThemeToggleIcon(theme) {
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (!themeBtn) return;

  const icon = themeBtn.querySelector(".theme-icon");
  if (icon) {
    icon.textContent = theme === THEMES.LIGHT ? "🌙" : "🌞";
  }

  themeBtn.setAttribute(
    "aria-label",
    theme === THEMES.LIGHT
      ? "Aktivizo temën e errët"
      : "Aktivizo temën e ndriçuar"
  );
}

function initTheme() {
  const storedTheme = getStoredTheme();

  // Apply stored theme on page load
  if (storedTheme === THEMES.LIGHT) {
    applyTheme(THEMES.LIGHT);
  }

  // Create theme toggle button if it doesn't exist
  createThemeToggleButton();

  // Listen for theme toggle button clicks
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }
}

function createThemeToggleButton() {
  // Check if button already exists
  if (document.getElementById("theme-toggle-btn")) return;

  const themeBtn = document.createElement("button");
  themeBtn.id = "theme-toggle-btn";
  themeBtn.className = "theme-toggle-btn";
  themeBtn.setAttribute("aria-label", "Ndrysho temën");
  themeBtn.innerHTML = `
    <span class="theme-icon">${
      getCurrentTheme() === THEMES.LIGHT ? "🌙" : "🌞"
    }</span>
  `;

  // Add to header actions or create floating button
  const headerActions = document.querySelector(".header-actions");
  if (headerActions) {
    headerActions.insertBefore(themeBtn, headerActions.firstChild);
  } else {
    // Create floating button if no header actions
    themeBtn.classList.add("theme-toggle-floating");
    document.body.appendChild(themeBtn);
  }

  // Add styles dynamically
  addThemeToggleStyles();
}

function addThemeToggleStyles() {
  if (document.getElementById("theme-toggle-styles")) return;

  const style = document.createElement("style");
  style.id = "theme-toggle-styles";
  style.textContent = `
    .theme-toggle-btn {
      background: transparent;
      border: 2px solid currentColor;
      border-radius: 50%;
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1.2rem;
      color: inherit;
    }
    
    .theme-toggle-btn:hover {
      transform: scale(1.1) rotate(15deg);
      background: rgba(255, 255, 255, 0.1);
    }
    
    .theme-toggle-btn:active {
      transform: scale(0.95);
    }
    
    .theme-toggle-floating {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 9999;
      background: linear-gradient(135deg, #F68732, #FF9D5C);
      color: white;
      border-color: white;
      box-shadow: 0 4px 15px rgba(246, 135, 50, 0.4);
    }
    
    .theme-toggle-floating:hover {
      box-shadow: 0 6px 25px rgba(246, 135, 50, 0.6);
      background: linear-gradient(135deg, #FF9D5C, #F68732);
    }
    
    .theme-icon {
      display: inline-block;
      transition: transform 0.3s ease;
    }
    
    .theme-toggle-btn:hover .theme-icon {
      transform: rotate(180deg);
    }
    
    @media (max-width: 600px) {
      .theme-toggle-floating {
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        font-size: 1.4rem;
      }
    }
  `;

  document.head.appendChild(style);
}

// ========== TOAST NOTIFICATION SYSTEM (Updated) ==========
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

      // Optional: Redirect after 2 seconds
      // setTimeout(() => {
      //   window.location.href = "index.html";
      // }, 2000);
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

// ========== MOBILE MENU TOGGLE ==========
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const headerNav = document.querySelector(".header-nav");

if (mobileMenuBtn && headerNav) {
  mobileMenuBtn.addEventListener("click", () => {
    headerNav.classList.toggle("active");
    mobileMenuBtn.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  document.addEventListener("click", (e) => {
    if (!headerNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      headerNav.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });

  headerNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      headerNav.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
      document.body.classList.remove("menu-open");
    });
  });
}

// ========== DROPDOWN TOGGLE FOR TOUCH/MOBILE ==========
// Dropdown with .dropdown-menu
document.querySelectorAll("[data-dropdown]").forEach((dd) => {
  const btn = dd.querySelector("[data-dropdown-toggle]");
  const menu = dd.querySelector(".dropdown-menu");

  // close others
  const closeAll = () => {
    document
      .querySelectorAll("[data-dropdown] .dropdown-menu")
      .forEach((m) => (m.style.display = "none"));
    document
      .querySelectorAll("[data-dropdown] [data-dropdown-toggle]")
      .forEach((b) => b.setAttribute("aria-expanded", "false"));
  };

  if (btn && menu) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const open = menu.style.display === "block";
      closeAll();
      if (!open) {
        menu.style.display = "block";
        btn.setAttribute("aria-expanded", "true");
      }
    });

    // click outside closes
    document.addEventListener("click", (e) => {
      if (!dd.contains(e.target)) {
        menu.style.display = "none";
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }
});

// Dropdown with .dropdown-panel (if you use this style)
document.querySelectorAll("[data-dropdown]").forEach((dd) => {
  const btn = dd.querySelector("[data-dropdown-toggle]");
  const menu = dd.querySelector(".dropdown-panel");

  function closeAll() {
    document.querySelectorAll("[data-dropdown]").forEach((x) => {
      x.classList.remove("open");
      const b = x.querySelector("[data-dropdown-toggle]");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }

  if (btn && menu) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const willOpen = !dd.classList.contains("open");
      closeAll();
      if (willOpen) {
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
  }
});

// ========== INITIALIZE ON PAGE LOAD ==========
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  console.log("🚀 Abissnet website initialized with theme switcher!");
});

console.log("🚀 Abissnet website scripts loaded!");
