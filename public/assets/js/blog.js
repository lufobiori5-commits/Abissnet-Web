// ========================================
// BLOG PAGE SPECIFIC JAVASCRIPT
// ========================================
// DEPENDENCIES: Requires toast.js to be loaded first
// Uses: showToast(), isValidEmail()
// ========================================

// Category Filter Functionality
const categoryBtns = document.querySelectorAll(".category-btn");
const blogCards = document.querySelectorAll(".blog-card");

categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    categoryBtns.forEach((b) => b.classList.remove("active"));

    // Add active class to clicked button
    btn.classList.add("active");

    const category = btn.dataset.category;

    // Filter blog cards with animation
    blogCards.forEach((card, index) => {
      if (category === "all") {
        card.style.display = "block";
        setTimeout(() => {
          card.classList.add("visible");
        }, index * 50);
      } else if (card.dataset.category === category) {
        card.style.display = "block";
        setTimeout(() => {
          card.classList.add("visible");
        }, index * 50);
      } else {
        card.classList.remove("visible");
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });

    // Show toast with selected category
    const categoryName = btn.textContent.trim();
    if (category !== "all") {
      showToast(`Filtro për: ${categoryName}`, "success");
    }
  });
});

// Blog Card Click Handlers
blogCards.forEach((card) => {
  card.addEventListener("click", function () {
    const title = this.querySelector(".blog-card-title")?.textContent;
    showToast(`Duke hapur: ${title}`, "success");

    // Optional: Navigate to blog post page
    // window.location.href = `/blog/${slug}`;
  });
});

// Featured Post Click
const featuredReadBtn = document.querySelector(".blog-read-btn");
if (featuredReadBtn) {
  featuredReadBtn.addEventListener("click", () => {
    const title = document.querySelector(".blog-featured-title")?.textContent;
    showToast(`Duke hapur: ${title}`, "success");

    // Optional: Navigate to featured post
    // window.location.href = `/blog/featured-post`;
  });
}

// Blog Newsletter Form
const blogNewsletterForm = document.getElementById("blog-newsletter-form");
if (blogNewsletterForm) {
  blogNewsletterForm.addEventListener("submit", function (e) {
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

    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Duke dërguar...";
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      showToast(
        `✅ Faleminderit për abonimin! Do të merrni përmbajtje ekskluzive në: ${email}`,
        "success"
      );
      emailInput.value = "";
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1000);
  });
}

// Scroll Animation for Blog Cards
const blogObserverOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const blogObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, index * 100);
      blogObserver.unobserve(entry.target);
    }
  });
}, blogObserverOptions);

// Observe all blog cards
blogCards.forEach((card) => {
  blogObserver.observe(card);
});

// Smooth Scroll to Top on Logo Click
const headerLogoLink = document.querySelector(".header-logo a");
if (headerLogoLink) {
  headerLogoLink.addEventListener("click", (e) => {
    if (
      window.location.pathname === "/blog.html" ||
      window.location.pathname.includes("blog")
    ) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  });
}

// Add loading animation on page load
window.addEventListener("load", () => {
  const blogHero = document.querySelector(".blog-hero-section");
  if (blogHero) {
    blogHero.style.opacity = "0";
    setTimeout(() => {
      blogHero.style.transition = "opacity 0.8s ease-in";
      blogHero.style.opacity = "1";
    }, 100);
  }
});

// Lazy load images
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// Search functionality (optional - add search bar in HTML if needed)
function searchBlogPosts(query) {
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm) {
    blogCards.forEach((card) => {
      card.style.display = "block";
      card.classList.add("visible");
    });
    return;
  }

  let foundCount = 0;

  blogCards.forEach((card) => {
    const title = card
      .querySelector(".blog-card-title")
      ?.textContent.toLowerCase();
    const excerpt = card
      .querySelector(".blog-card-excerpt")
      ?.textContent.toLowerCase();
    const category = card
      .querySelector(".blog-card-tag")
      ?.textContent.toLowerCase();

    if (
      title?.includes(searchTerm) ||
      excerpt?.includes(searchTerm) ||
      category?.includes(searchTerm)
    ) {
      card.style.display = "block";
      card.classList.add("visible");
      foundCount++;
    } else {
      card.classList.remove("visible");
      setTimeout(() => {
        card.style.display = "none";
      }, 300);
    }
  });

  if (foundCount === 0) {
    showToast("Nuk u gjet asnjë artikull për këtë kërkim.", "error");
  } else {
    showToast(`U gjetën ${foundCount} artikuj.`, "success");
  }
}

// Keyboard shortcuts (optional)
document.addEventListener("keydown", (e) => {
  // Press '/' to focus search (if you add search functionality)
  if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
    e.preventDefault();
    const searchInput = document.querySelector(".blog-search-input");
    if (searchInput) {
      searchInput.focus();
    }
  }

  // Press 'Escape' to clear filters
  if (e.key === "Escape") {
    const allBtn = document.querySelector('.category-btn[data-category="all"]');
    if (allBtn) {
      allBtn.click();
    }
  }
});

console.log("📝 Blog page initialized!");
