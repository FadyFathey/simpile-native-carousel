// Select DOM elements
const carouselWrapper = document.querySelector(".carousel-wrapper");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
const bulletsContainer = document.querySelector(".bullets-container");
const carouselContainer = document.querySelector(".carousel-container");

// Images array
const images = [
  "imgs/img-1.jpg",
  "imgs/img-2.jpg",
  "imgs/img-3.jpg",
  "imgs/img-4.jpg",
];

let currentImgNumber = 0;
let isAnimating = false;

// Function to create carousel slides
function createSlides() {
  images.forEach((imgSrc, index) => {
    const slide = document.createElement("div");
    slide.classList.add("carousel-slide");

    const img = document.createElement("img");
    img.classList.add("carousel-image");
    img.src = imgSrc;
    img.alt = `Carousel Image ${index + 1}`;

    slide.appendChild(img);
    carouselWrapper.appendChild(slide);
  });
}

// Function to update the carousel position
function updateCarousel(transition = true) {
  if (transition) {
    carouselWrapper.style.transition = "transform 0.6s ease-in-out";
  } else {
    carouselWrapper.style.transition = "none";
  }

  // Move wrapper to show current slide
  carouselWrapper.style.transform = `translateX(-${currentImgNumber * 100}%)`;

  // Update bullets
  const bullets = document.querySelectorAll(".bullet");
  bullets.forEach((bullet, index) => {
    if (index === currentImgNumber) {
      bullet.classList.add("active");
    } else {
      bullet.classList.remove("active");
    }
  });
}

// Create bullet indicators
function createBullets() {
  images.forEach((_, index) => {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    if (index === currentImgNumber) {
      bullet.classList.add("active");
    }

    // Add click event to each bullet
    bullet.addEventListener("click", () => {
      if (isAnimating) return;
      currentImgNumber = index;
      updateCarousel();
    });

    bulletsContainer.appendChild(bullet);
  });
}

// Go to next slide
function nextSlide() {
  if (isAnimating) return;
  isAnimating = true;

  if (currentImgNumber < images.length - 1) {
    currentImgNumber += 1;
  } else {
    // When at the last slide, quickly jump to first slide
    currentImgNumber = 0;
  }

  updateCarousel();
  setTimeout(() => {
    isAnimating = false;
  }, 600);
}

// Go to previous slide
function prevSlide() {
  if (isAnimating) return;
  isAnimating = true;

  if (currentImgNumber > 0) {
    currentImgNumber -= 1;
  } else {
    // When at the first slide, quickly jump to last slide
    currentImgNumber = images.length - 1;
  }

  updateCarousel();
  setTimeout(() => {
    isAnimating = false;
  }, 600);
}

// Initialize carousel
function initCarousel() {
  // Create slides from images
  createSlides();

  // Create bullets
  createBullets();

  // Set initial position
  updateCarousel(false);

  // Right arrow click event
  rightArrow.addEventListener("click", nextSlide);

  // Left arrow click event
  leftArrow.addEventListener("click", prevSlide);

  // Add keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      nextSlide();
    } else if (e.key === "ArrowLeft") {
      prevSlide();
    }
  });

  // Handle transition end
  carouselWrapper.addEventListener("transitionend", () => {
    isAnimating = false;
  });

  // Add swipe functionality for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  carouselContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carouselContainer.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    if (touchStartX - touchEndX > minSwipeDistance) {
      // Swipe left
      nextSlide();
    } else if (touchEndX - touchStartX > minSwipeDistance) {
      // Swipe right
      prevSlide();
    }
  }

  const autoSlideInterval = 5000; // 5 seconds
  let autoSlideTimer = setInterval(nextSlide, autoSlideInterval);

  carouselContainer.addEventListener("mouseenter", () => {
    clearInterval(autoSlideTimer);
  });

  carouselContainer.addEventListener("mouseleave", () => {
    autoSlideTimer = setInterval(nextSlide, autoSlideInterval);
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initCarousel);
