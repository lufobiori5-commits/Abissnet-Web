// ==========================================
// EMAIL HOSTING PAGE - MODERN INTERACTIONS
// ==========================================

(function () {
  "use strict";

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  // Email validation
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Phone validation (Albanian format)
  function isValidPhone(phone) {
    return /^(\+355|0)?[6-9]\d{8}$/.test(phone.replace(/\s/g, ""));
  }

  // ==========================================
  // YEAR IN FOOTER
  // ==========================================
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ==========================================
  // LOGO FALLBACK
  // ==========================================
  const logoImg = document.getElementById("logo-img");
  if (logoImg) {
    logoImg.addEventListener("error", function () {
      this.style.display = "none";
      const fallback = this.nextElementSibling;
      if (fallback && fallback.classList.contains("logo-fallback")) {
        fallback.style.display = "block";
      }
    });
  }

  // ==========================================
  // PACKAGE SELECTION
  // ==========================================
  document.querySelectorAll(".package-btn-modern").forEach((btn) => {
    btn.addEventListener("click", function () {
      const packageType = this.dataset.package;
      const packageSelect = document.getElementById("paketa");

      if (packageSelect) {
        packageSelect.value = packageType;
      }

      // Scroll to contact form
      const contactSection = document.getElementById("apliko");
      if (contactSection) {
        const headerOffset = 100;
        const elementPosition = contactSection.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }

      // Show toast
      if (typeof showToast === "function") {
        const packageNames = {
          basic: "Basic",
          core: "Core",
          pro: "Pro",
        };
        showToast(
          `Paketa ${packageNames[packageType]} është zgjedhur. Plotëso formularin më poshtë.`,
          "success"
        );
      }

      // Add visual feedback
      document.querySelectorAll(".package-card-modern").forEach((card) => {
        card.style.opacity = "0.6";
      });
      this.closest(".package-card-modern").style.opacity = "1";
      setTimeout(() => {
        document.querySelectorAll(".package-card-modern").forEach((card) => {
          card.style.opacity = "1";
        });
      }, 1500);
    });
  });

  // ==========================================
  // FORM HANDLING
  // ==========================================
  const emailHostingForm = document.getElementById("email-hosting-form");
  if (emailHostingForm) {
    emailHostingForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = {
        emri: formData.get("emri"),
        telefoni: formData.get("telefoni"),
        email: formData.get("email"),
        paketa: formData.get("paketa"),
        mesazhi: formData.get("mesazhi"),
      };

      // Validation
      if (!data.emri || !data.telefoni || !data.email) {
        if (typeof showToast === "function") {
          showToast(
            "Të gjitha fushat e shënuara me * janë të detyrueshme!",
            "error"
          );
        }
        return;
      }

      if (!isValidEmail(data.email)) {
        if (typeof showToast === "function") {
          showToast("Email-i nuk është valid!", "error");
        }
        return;
      }

      if (!isValidPhone(data.telefoni)) {
        if (typeof showToast === "function") {
          showToast(
            "Numri i telefonit nuk është valid! Formati: +355 6X XXX XXXX",
            "error"
          );
        }
        return;
      }

      // Show loading state
      const submitBtn = this.querySelector(".form-submit-btn");
      const btnText = submitBtn.querySelector(".btn-text");
      const btnLoading = submitBtn.querySelector(".btn-loading");

      btnText.style.display = "none";
      btnLoading.style.display = "inline";
      submitBtn.disabled = true;

      try {
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/email-hosting-lead', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Success
        if (typeof showToast === "function") {
          showToast(
            "✓ Kërkesa u dërgua me sukses! Do të kontaktoheni brenda 24 orëve.",
            "success",
            5000
          );
        }

        // Reset form
        this.reset();

        // Show success message in form
        const formStatus = document.getElementById("form-status");
        if (formStatus) {
          formStatus.className = "form-status success";
          formStatus.textContent =
            "✓ Faleminderit! Kërkesa juaj u dërgua me sukses.";
          formStatus.style.display = "block";

          setTimeout(() => {
            formStatus.style.display = "none";
          }, 5000);
        }
      } catch (error) {
        console.error("Form submission error:", error);
        if (typeof showToast === "function") {
          showToast("✗ Dështoi dërgimi. Ju lutem provoni përsëri.", "error");
        }
      } finally {
        // Reset button state
        btnText.style.display = "inline";
        btnLoading.style.display = "none";
        submitBtn.disabled = false;
      }
    });

    // Real-time validation feedback
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.addEventListener("blur", function () {
        if (this.value && !isValidEmail(this.value)) {
          this.style.borderColor = "#ef4444";
        } else {
          this.style.borderColor = "";
        }
      });
    }

    const phoneInput = document.getElementById("telefoni");
    if (phoneInput) {
      phoneInput.addEventListener("blur", function () {
        if (this.value && !isValidPhone(this.value)) {
          this.style.borderColor = "#ef4444";
        } else {
          this.style.borderColor = "";
        }
      });
    }
  }

  // ==========================================
  // SMOOTH SCROLL FOR SUBNAV
  // ==========================================
  document.querySelectorAll(".subnav .pill").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 100;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Update active state
          document
            .querySelectorAll(".subnav .pill")
            .forEach((p) => p.classList.remove("active"));
          this.classList.add("active");
        }
      }
    });
  });

  // ==========================================
  // SCROLL SPY FOR SUBNAV
  // ==========================================
  const sections = ["paketat", "avantazhet", "pricing", "apliko"];
  const navLinks = document.querySelectorAll(".subnav .pill");

  function updateActiveNav() {
    const scrollPos = window.scrollY + 150;

    sections.forEach((sectionId, index) => {
      const section = document.getElementById(sectionId);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
          navLinks.forEach((link) => link.classList.remove("active"));
          if (navLinks[index]) {
            navLinks[index].classList.add("active");
          }
        }
      }
    });
  }

  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveNav, 100);
  });

  // ==========================================
  // ANIMATED STATS COUNTER
  // ==========================================
  function animateStats() {
    const statNumbers = document.querySelectorAll(".stat-number");

    if (!statNumbers.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const text = target.textContent.trim();

            // Check if it contains a number
            const match = text.match(/\d+/);
            if (match) {
              const finalValue = parseInt(match[0]);
              const hasPercent = text.includes("%");
              animateValue(target, 0, finalValue, 1000, hasPercent);
            }

            observer.unobserve(target);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    statNumbers.forEach((stat) => observer.observe(stat));
  }

  function animateValue(element, start, end, duration, hasPercent = false) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    const originalText = element.textContent;

    const timer = setInterval(() => {
      current += increment;

      if (current >= end) {
        current = end;
        clearInterval(timer);
        // Restore original text to preserve formatting
        element.textContent = originalText;
      } else {
        const value = Math.floor(current);
        element.textContent = hasPercent ? `${value}%` : value;
      }
    }, 16);
  }

  // ==========================================
  // SCROLL ANIMATIONS FOR CARDS
  // ==========================================
  function initScrollAnimations() {
    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
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

    // Observe package cards
    document.querySelectorAll(".package-card-modern").forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "all 0.6s ease-out";
      observer.observe(card);
    });

    // Observe feature items
    document.querySelectorAll(".feature-item").forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(30px)";
      item.style.transition = "all 0.6s ease-out";
      observer.observe(item);
    });
  }

  // ==========================================
  // INITIALIZE
  // ==========================================
  function init() {
    console.log("✉️ Email Hosting page initializing...");
    animateStats();
    initScrollAnimations();
    console.log("✅ Email Hosting page ready!");
  }

  // Run init when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
JSEOF;
cat / mnt / user - data / outputs / email - hosting - modern.js;
Output(
  // ==========================================
  // EMAIL HOSTING PAGE - MODERN INTERACTIONS
  // ==========================================

  function () {
    "use strict";

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================

    // Email validation
    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Phone validation (Albanian format)
    function isValidPhone(phone) {
      return /^(\+355|0)?[6-9]\d{8}$/.test(phone.replace(/\s/g, ""));
    }

    // ==========================================
    // YEAR IN FOOTER
    // ==========================================
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }

    // ==========================================
    // LOGO FALLBACK
    // ==========================================
    const logoImg = document.getElementById("logo-img");
    if (logoImg) {
      logoImg.addEventListener("error", function () {
        this.style.display = "none";
        const fallback = this.nextElementSibling;
        if (fallback && fallback.classList.contains("logo-fallback")) {
          fallback.style.display = "block";
        }
      });
    }

    // ==========================================
    // PACKAGE SELECTION
    // ==========================================
    document.querySelectorAll(".package-btn-modern").forEach((btn) => {
      btn.addEventListener("click", function () {
        const packageType = this.dataset.package;
        const packageSelect = document.getElementById("paketa");

        if (packageSelect) {
          packageSelect.value = packageType;
        }

        // Scroll to contact form
        const contactSection = document.getElementById("apliko");
        if (contactSection) {
          const headerOffset = 100;
          const elementPosition = contactSection.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }

        // Show toast
        if (typeof showToast === "function") {
          const packageNames = {
            basic: "Basic",
            core: "Core",
            pro: "Pro",
          };
          showToast(
            `Paketa ${packageNames[packageType]} është zgjedhur. Plotëso formularin më poshtë.`,
            "success"
          );
        }

        // Add visual feedback
        document.querySelectorAll(".package-card-modern").forEach((card) => {
          card.style.opacity = "0.6";
        });
        this.closest(".package-card-modern").style.opacity = "1";
        setTimeout(() => {
          document.querySelectorAll(".package-card-modern").forEach((card) => {
            card.style.opacity = "1";
          });
        }, 1500);
      });
    });

    // ==========================================
    // FORM HANDLING
    // ==========================================
    const emailHostingForm = document.getElementById("email-hosting-form");
    if (emailHostingForm) {
      emailHostingForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = {
          emri: formData.get("emri"),
          telefoni: formData.get("telefoni"),
          email: formData.get("email"),
          paketa: formData.get("paketa"),
          mesazhi: formData.get("mesazhi"),
        };

        // Validation
        if (!data.emri || !data.telefoni || !data.email) {
          if (typeof showToast === "function") {
            showToast(
              "Të gjitha fushat e shënuara me * janë të detyrueshme!",
              "error"
            );
          }
          return;
        }

        if (!isValidEmail(data.email)) {
          if (typeof showToast === "function") {
            showToast("Email-i nuk është valid!", "error");
          }
          return;
        }

        if (!isValidPhone(data.telefoni)) {
          if (typeof showToast === "function") {
            showToast(
              "Numri i telefonit nuk është valid! Formati: +355 6X XXX XXXX",
              "error"
            );
          }
          return;
        }

        // Show loading state
        const submitBtn = this.querySelector(".form-submit-btn");
        const btnText = submitBtn.querySelector(".btn-text");
        const btnLoading = submitBtn.querySelector(".btn-loading");

        btnText.style.display = "none";
        btnLoading.style.display = "inline";
        submitBtn.disabled = true;

        try {
          // TODO: Replace with actual API endpoint
          // const response = await fetch('/api/email-hosting-lead', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(data)
          // });

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Success
          if (typeof showToast === "function") {
            showToast(
              "✓ Kërkesa u dërgua me sukses! Do të kontaktoheni brenda 24 orëve.",
              "success",
              5000
            );
          }

          // Reset form
          this.reset();

          // Show success message in form
          const formStatus = document.getElementById("form-status");
          if (formStatus) {
            formStatus.className = "form-status success";
            formStatus.textContent =
              "✓ Faleminderit! Kërkesa juaj u dërgua me sukses.";
            formStatus.style.display = "block";

            setTimeout(() => {
              formStatus.style.display = "none";
            }, 5000);
          }
        } catch (error) {
          console.error("Form submission error:", error);
          if (typeof showToast === "function") {
            showToast("✗ Dështoi dërgimi. Ju lutem provoni përsëri.", "error");
          }
        } finally {
          // Reset button state
          btnText.style.display = "inline";
          btnLoading.style.display = "none";
          submitBtn.disabled = false;
        }
      });

      // Real-time validation feedback
      const emailInput = document.getElementById("email");
      if (emailInput) {
        emailInput.addEventListener("blur", function () {
          if (this.value && !isValidEmail(this.value)) {
            this.style.borderColor = "#ef4444";
          } else {
            this.style.borderColor = "";
          }
        });
      }

      const phoneInput = document.getElementById("telefoni");
      if (phoneInput) {
        phoneInput.addEventListener("blur", function () {
          if (this.value && !isValidPhone(this.value)) {
            this.style.borderColor = "#ef4444";
          } else {
            this.style.borderColor = "";
          }
        });
      }
    }

    // ==========================================
    // SMOOTH SCROLL FOR SUBNAV
    // ==========================================
    document.querySelectorAll(".subnav .pill").forEach((link) => {
      link.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });

            // Update active state
            document
              .querySelectorAll(".subnav .pill")
              .forEach((p) => p.classList.remove("active"));
            this.classList.add("active");
          }
        }
      });
    });

    // ==========================================
    // SCROLL SPY FOR SUBNAV
    // ==========================================
    const sections = ["paketat", "avantazhet", "pricing", "apliko"];
    const navLinks = document.querySelectorAll(".subnav .pill");

    function updateActiveNav() {
      const scrollPos = window.scrollY + 150;

      sections.forEach((sectionId, index) => {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
            navLinks.forEach((link) => link.classList.remove("active"));
            if (navLinks[index]) {
              navLinks[index].classList.add("active");
            }
          }
        }
      });
    }

    let scrollTimeout;
    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateActiveNav, 100);
    });

    // ==========================================
    // ANIMATED STATS COUNTER
    // ==========================================
    function animateStats() {
      const statNumbers = document.querySelectorAll(".stat-number");

      if (!statNumbers.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target;
              const text = target.textContent.trim();

              // Check if it contains a number
              const match = text.match(/\d+/);
              if (match) {
                const finalValue = parseInt(match[0]);
                const hasPercent = text.includes("%");
                animateValue(target, 0, finalValue, 1000, hasPercent);
              }

              observer.unobserve(target);
            }
          });
        },
        {
          threshold: 0.5,
        }
      );

      statNumbers.forEach((stat) => observer.observe(stat));
    }

    function animateValue(element, start, end, duration, hasPercent = false) {
      const range = end - start;
      const increment = range / (duration / 16);
      let current = start;
      const originalText = element.textContent;

      const timer = setInterval(() => {
        current += increment;

        if (current >= end) {
          current = end;
          clearInterval(timer);
          // Restore original text to preserve formatting
          element.textContent = originalText;
        } else {
          const value = Math.floor(current);
          element.textContent = hasPercent ? `${value}%` : value;
        }
      }, 16);
    }

    // ==========================================
    // SCROLL ANIMATIONS FOR CARDS
    // ==========================================
    function initScrollAnimations() {
      if (!("IntersectionObserver" in window)) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
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

      // Observe package cards
      document.querySelectorAll(".package-card-modern").forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "all 0.6s ease-out";
        observer.observe(card);
      });

      // Observe feature items
      document.querySelectorAll(".feature-item").forEach((item) => {
        item.style.opacity = "0";
        item.style.transform = "translateY(30px)";
        item.style.transition = "all 0.6s ease-out";
        observer.observe(item);
      });
    }

    // ==========================================
    // INITIALIZE
    // ==========================================
    function init() {
      console.log("✉️ Email Hosting page initializing...");
      animateStats();
      initScrollAnimations();
      console.log("✅ Email Hosting page ready!");
    }

    // Run init when DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
)();
