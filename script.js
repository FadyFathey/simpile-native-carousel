// Select DOM elements
const carouselWrapper = document.querySelector(".carousel-wrapper");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
const bulletsContainer = document.querySelector(".bullets-container");
const carouselContainer = document.querySelector(".carousel-container");
const mainSpinner = document.getElementById("main-spinner");

// Images array
const images = [
  "imgs/img-1.jpg",
  "imgs/img-2.jpg",
  "imgs/img-3.jpg",
  "imgs/img-4.jpg",
];

// Image quality tiers (low to high) for progressive loading
const qualityTiers = [
  { suffix: "-thumbnail.jpg", size: "small" },
  { suffix: "-medium.jpg", size: "medium" },
  { suffix: "", size: "large" }, // Original image
];

let currentImgNumber = 0;
let isAnimating = false;
let imagesLoaded = 0;
let loadedImages = new Array(images.length).fill(false);

// Create low-quality thumbnails
// Note: You'll need to create these smaller versions of your images
function getThumbnailPath(imagePath) {
  // For the implementation on GitHub Pages where you don't have server-side processing
  // you'd need to manually create smaller versions of your images
  // This is a simplified example using the original path
  return imagePath;

  // In a real implementation with prepared images, you might do something like:
  // return imagePath.replace('.jpg', '-thumbnail.jpg');
}

// Detect WebP support
function supportsWebP() {
  const elem = document.createElement("canvas");
  if (elem.getContext && elem.getContext("2d")) {
    return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  }
  return false;
}

// Get the most efficient image format path
function getOptimizedImagePath(path) {
  // If you have WebP versions of your images, use them
  // For implementation on GitHub Pages, you'd need to create these WebP versions
  if (supportsWebP()) {
    return path.replace(".jpg", ".webp");
  }
  return path;
}

// Preload critical images
function preloadImages() {
  // Only preload first image and next image initially
  const imagesToPreload = images.slice(0, Math.min(2, images.length));
  let loadedCount = 0;

  imagesToPreload.forEach((imagePath, index) => {
    const img = new Image();
    img.onload = () => {
      loadedCount++;
      loadedImages[index] = true;

      // Hide spinner when the first image is loaded
      if (loadedCount === 1) {
        mainSpinner.style.display = "none";
        document.querySelectorAll(".carousel-image")[0].classList.add("loaded");
      }
    };
    img.src = getOptimizedImagePath(imagePath);
  });
}

// Function to create carousel slides
function createSlides() {
  images.forEach((imgSrc, index) => {
    const slide = document.createElement("div");
    slide.classList.add("carousel-slide");

    // Create placeholder
    const placeholder = document.createElement("div");
    placeholder.classList.add("image-placeholder");

    // Create spinner inside placeholder
    const spinner = document.createElement("div");
    spinner.classList.add("loading-spinner");
    placeholder.appendChild(spinner);

    // Create the actual image
    const img = document.createElement("img");
    img.classList.add("carousel-image");

    // Only set source for first image immediately
    if (index === 0) {
      img.src = getOptimizedImagePath(imgSrc);
    } else {
      // Use data-src for lazy loading
      img.dataset.src = getOptimizedImagePath(imgSrc);
    }

    img.alt = `Carousel Image ${index + 1}`;

    // Handle image loading
    img.onload = () => {
      img.classList.add("loaded");
      spinner.style.display = "none";
      loadedImages[index] = true;
    };

    slide.appendChild(placeholder);
    slide.appendChild(img);
    carouselWrapper.appendChild(slide);
  });
}

// Load image for a specific slide
function loadSlideImage(slideIndex) {
  if (slideIndex < 0 || slideIndex >= images.length) return;

  const slides = document.querySelectorAll(".carousel-slide");
  if (!slides[slideIndex]) return;

  const img = slides[slideIndex].querySelector(".carousel-image");
  const spinner = slides[slideIndex].querySelector(".loading-spinner");

  if (img && img.dataset.src && !loadedImages[slideIndex]) {
    spinner.style.display = "block";
    img.src = img.dataset.src;
    img.onload = () => {
      img.classList.add("loaded");
      spinner.style.display = "none";
      loadedImages[slideIndex] = true;
    };
    // Remove data-src to prevent reloading
    img.removeAttribute("data-src");
  }
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

  // Load current image if not already loaded
  loadSlideImage(currentImgNumber);

  // Preload next and previous images
  loadSlideImage(currentImgNumber + 1);
  loadSlideImage(currentImgNumber - 1);

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

  // Preload critical images
  preloadImages();

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
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initCarousel);
