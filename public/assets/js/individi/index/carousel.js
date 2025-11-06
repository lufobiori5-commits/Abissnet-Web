(function () {
  const viewport = document.getElementById("carouselViewport");
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  const dotsContainer = document.getElementById("carouselDots");
  const slides = [...track.querySelectorAll(".carousel-slide")];

  let currentIndex = 0;
  let slidesPerView = 3;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 5000;

  // Calculate slides per view
  function getSlidesPerView() {
    const width = window.innerWidth;
    if (width >= 1200) return 3;
    if (width >= 768) return 2;
    return 1;
  }

  // Update layout
  function updateLayout() {
    slidesPerView = getSlidesPerView();
    const slideWidth = viewport.clientWidth / slidesPerView;
    slides.forEach((slide) => {
      slide.style.width = `${slideWidth}px`;
    });
    createDots();
    goToSlide(currentIndex);
  }

  // Go to specific slide
  function goToSlide(index) {
    const maxIndex = Math.max(0, slides.length - slidesPerView);
    currentIndex = Math.min(Math.max(index, 0), maxIndex);

    const slideWidth =
      slides[0].getBoundingClientRect().width +
      parseFloat(getComputedStyle(track).gap || 0);
    const offset = currentIndex * slideWidth;

    track.style.transform = `translateX(-${offset}px)`;
    updateButtons();
    updateDots();
  }

  // Navigation
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Update button states
  function updateButtons() {
    const maxIndex = slides.length - slidesPerView;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  // Create dots
  function createDots() {
    dotsContainer.innerHTML = "";
    const totalPages = Math.ceil(slides.length / slidesPerView);

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("span");
      dot.className = "carousel-dot";
      dot.addEventListener("click", () => {
        stopAutoplay();
        goToSlide(i * slidesPerView);
        startAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  // Update active dot
  function updateDots() {
    const dots = dotsContainer.querySelectorAll(".carousel-dot");
    const activePage = Math.floor(currentIndex / slidesPerView);
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === activePage);
    });
  }

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      if (currentIndex >= slides.length - slidesPerView) {
        goToSlide(0);
      } else {
        nextSlide();
      }
    }, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Click handlers
  nextBtn.addEventListener("click", () => {
    stopAutoplay();
    nextSlide();
    startAutoplay();
  });

  prevBtn.addEventListener("click", () => {
    stopAutoplay();
    prevSlide();
    startAutoplay();
  });

  // Card click navigation
  slides.forEach((slide) => {
    slide.addEventListener("click", () => {
      const href = slide.dataset.href;
      if (href) window.location.href = href;
    });
  });

  // Pause on hover
  viewport.addEventListener("mouseenter", stopAutoplay);
  viewport.addEventListener("mouseleave", startAutoplay);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      stopAutoplay();
      prevSlide();
      startAutoplay();
    } else if (e.key === "ArrowRight") {
      stopAutoplay();
      nextSlide();
      startAutoplay();
    }
  });

  // Initialize
  window.addEventListener("resize", updateLayout);
  updateLayout();
  startAutoplay();
})();
