// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", function () {
	// Select the elements
	const slider = document.querySelector(".slider");
	const slidesContainer = document.querySelector(".slides");
	const slides = document.querySelectorAll(".slide");
	const prevBtn = document.querySelector(".prev");
	const nextBtn = document.querySelector(".next");
	const totalSlidesElement = document.querySelector(
		".slide-counter #total-slides"
	);

	// Initialize the variables
	let currentIndex = 0;
	let slideWidth = 0;
	let slidesPerView = 1;
	let autoSlideInterval;

	// Update total slides counter
	if (totalSlidesElement) {
		totalSlidesElement.textContent = slides.length;
	}

	// Initialize slider
	function initSlider() {
		updateSlidesPerView();
		updateSlideWidth();

		// Initialize scroll position
		slidesContainer.scrollLeft = 0;

		scrollToSlide();
		startAutoSlide();
		console.log("Slider initialized:", {
			slidesPerView,
			slideWidth,
			totalSlides: slides.length,
		});
	}

	// Update number of slides visible based on screen size
	function updateSlidesPerView() {
		const width = window.innerWidth;
		if (width >= 1024) {
			slidesPerView = 4;
		} else if (width >= 768) {
			slidesPerView = 3;
		} else if (width >= 567) {
			slidesPerView = 2;
		} else {
			slidesPerView = 1;
		}
		console.log("Updated slides per view:", { width, slidesPerView });
	}

	// Calculate slide width including gap
	function updateSlideWidth() {
		const containerWidth = slidesContainer.offsetWidth;
		const gap = 10; // Gap between slides
		const padding = 40; // Account for left and right padding (20px each)

		// Calculate available space for slides
		const availableSpace = containerWidth - padding;
		// Calculate slide width: (available space - gaps) / number of slides
		slideWidth =
			(availableSpace - gap * (slidesPerView - 1)) / slidesPerView;

		console.log("Updated slide width:", {
			containerWidth,
			gap,
			padding,
			availableSpace,
			slidesPerView,
			slideWidth,
		});
	}

	// Scroll to the current slide
	function scrollToSlide() {
		const gap = 10;
		const slideTotalWidth = slideWidth + gap;
		const scrollPosition = currentIndex * slideTotalWidth;

		slidesContainer.scrollTo({
			left: scrollPosition,
			behavior: "smooth",
		});

		console.log("Scrolling to slide:", {
			currentIndex,
			slideWidth,
			gap,
			slideTotalWidth,
			scrollPosition,
			slidesPerView,
			visibleSlides: `slides ${currentIndex} to ${
				currentIndex + slidesPerView - 1
			}`,
		});
	}

	// Go to next slide
	function nextSlide() {
		if (currentIndex < slides.length - slidesPerView) {
			currentIndex++;
		} else {
			currentIndex = 0; // Loop back to first slide
		}
		scrollToSlide();
		updateButtonStates();
	}

	// Go to previous slide
	function prevSlide() {
		if (currentIndex > 0) {
			currentIndex--;
		} else {
			currentIndex = slides.length - slidesPerView; // Loop to last possible position
		}
		scrollToSlide();
		updateButtonStates();
	}

	// Update slide counter
	function updateSlideCounter() {
		const currentSlideElement = document.getElementById("current-slide");
		const totalSlidesElement = document.getElementById("total-slides");

		if (currentSlideElement && totalSlidesElement) {
			currentSlideElement.textContent = currentIndex + 1;
			totalSlidesElement.textContent = slides.length;
		}
	}

	// Update button states (disable when at boundaries)
	function updateButtonStates() {
		prevBtn.disabled = currentIndex === 0;
		nextBtn.disabled = currentIndex >= slides.length - slidesPerView;

		// Visual feedback for disabled state
		if (prevBtn.disabled) {
			prevBtn.style.opacity = "0.5";
			prevBtn.style.cursor = "not-allowed";
		} else {
			prevBtn.style.opacity = "1";
			prevBtn.style.cursor = "pointer";
		}

		if (nextBtn.disabled) {
			nextBtn.style.opacity = "0.5";
			nextBtn.style.cursor = "not-allowed";
		} else {
			nextBtn.style.opacity = "1";
			nextBtn.style.cursor = "pointer";
		}

		// Update slide counter
		updateSlideCounter();
	}

	// Start automatic sliding
	function startAutoSlide() {
		autoSlideInterval = setInterval(() => {
			nextSlide(); // This will handle the looping logic
		}, 10000); // Change slide every 10 seconds
	}

	// Stop automatic sliding
	function stopAutoSlide() {
		if (autoSlideInterval) {
			clearInterval(autoSlideInterval);
		}
	}

	// Event listeners
	prevBtn.addEventListener("click", function () {
		if (!prevBtn.disabled) {
			stopAutoSlide();
			prevSlide();
			startAutoSlide();
		}
	});

	nextBtn.addEventListener("click", function () {
		if (!nextBtn.disabled) {
			stopAutoSlide();
			nextSlide();
			startAutoSlide();
		}
	});

	// Pause auto-slide on hover
	slider.addEventListener("mouseenter", stopAutoSlide);
	slider.addEventListener("mouseleave", startAutoSlide);

	// Handle window resize
	window.addEventListener("resize", function () {
		updateSlidesPerView();
		updateSlideWidth();

		// Reset scroll position on resize
		slidesContainer.scrollLeft = 0;

		// Reset to first slide if current index is out of bounds
		if (currentIndex >= slides.length - slidesPerView + 1) {
			currentIndex = 0;
		}
		scrollToSlide();
		updateButtonStates();
	});

	// Keyboard navigation
	document.addEventListener("keydown", function (e) {
		if (e.key === "ArrowLeft") {
			e.preventDefault();
			if (!prevBtn.disabled) {
				stopAutoSlide();
				prevSlide();
				startAutoSlide();
			}
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			if (!nextBtn.disabled) {
				stopAutoSlide();
				nextSlide();
				startAutoSlide();
			}
		}
	});

	// Touch/swipe support for mobile
	let touchStartX = 0;
	let touchEndX = 0;

	slidesContainer.addEventListener("touchstart", function (e) {
		touchStartX = e.changedTouches[0].screenX;
	});

	slidesContainer.addEventListener("touchend", function (e) {
		touchEndX = e.changedTouches[0].screenX;
		handleSwipe();
	});

	function handleSwipe() {
		const swipeThreshold = 50;
		const diff = touchStartX - touchEndX;

		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0 && !nextBtn.disabled) {
				// Swipe left - next slide
				stopAutoSlide();
				nextSlide();
				startAutoSlide();
			} else if (diff < 0 && !prevBtn.disabled) {
				// Swipe right - previous slide
				stopAutoSlide();
				prevSlide();
				startAutoSlide();
			}
		}
	}

	// Initialize the slider
	setTimeout(() => {
		initSlider();
	}, 100);
});
