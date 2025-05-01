// Wait for DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("show");

      // Change icon based on menu state
      const icon = mobileMenuToggle.querySelector("i");
      if (navMenu.classList.contains("show")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });
  }

  // Image loading animations
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    // For images that are already loaded
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      // For images that will load later
      img.addEventListener("load", function () {
        this.classList.add("loaded");
      });
    }

    // If image fails to load
    img.addEventListener("error", function () {
      this.classList.add("error");
    });
  });

  // Pricing toggle functionality
  const pricingToggle = document.getElementById("pricing-toggle");
  const monthlyPlan = document.querySelector(".pricing-plans.monthly");
  const yearlyPlan = document.querySelector(".pricing-plans.yearly");
  const monthlyLabel = document.querySelector(".toggle-label:first-of-type");
  const yearlyLabel = document.querySelector(".toggle-label:nth-of-type(2)");

  if (pricingToggle) {
    pricingToggle.addEventListener("change", function () {
      if (this.checked) {
        // Show yearly plans
        monthlyPlan.classList.remove("active");
        yearlyPlan.classList.add("active");
        monthlyLabel.classList.remove("active");
        yearlyLabel.classList.add("active");
      } else {
        // Show monthly plans
        yearlyPlan.classList.remove("active");
        monthlyPlan.classList.add("active");
        yearlyLabel.classList.remove("active");
        monthlyLabel.classList.add("active");
      }
    });

    // Handle labels click for better UX
    monthlyLabel.addEventListener("click", function () {
      pricingToggle.checked = false;
      pricingToggle.dispatchEvent(new Event("change"));
    });

    yearlyLabel.addEventListener("click", function () {
      pricingToggle.checked = true;
      pricingToggle.dispatchEvent(new Event("change"));
    });
  }

  // FAQ accordion functionality
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      // Check if current item is already active
      const isActive = item.classList.contains("active");

      // Close all FAQ items
      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("active");
      });

      // If the clicked item wasn't active, make it active
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });

  // Testimonial slider
  const testimonialSlider = document.querySelector(".testimonials-slider");
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const dots = document.querySelectorAll(".dot");
  let currentSlide = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  // Set up the initial slide
  function showSlide(index) {
    // Reset all active dots
    dots.forEach((dot) => dot.classList.remove("active"));

    // For mobile view (stacked cards)
    if (window.innerWidth <= 768) {
      testimonialCards.forEach((card, i) => {
        card.style.display = i === index ? "block" : "none";
      });
    } else {
      // For desktop view (horizontal scroll)
      if (testimonialSlider) {
        const cardWidth = testimonialCards[0].offsetWidth;
        const margin = parseInt(
          window.getComputedStyle(testimonialCards[0]).marginRight
        );
        const scrollAmount = index * (cardWidth + margin);
        testimonialSlider.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }

    // Set the active dot
    if (dots[index]) {
      dots[index].classList.add("active");
    }

    currentSlide = index;
  }

  // Add click event listeners to dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });

  // Auto-advance slides every 5 seconds
  function autoAdvance() {
    const nextSlide = (currentSlide + 1) % testimonialCards.length;
    showSlide(nextSlide);
  }

  // Set up auto-advance interval
  let slideInterval = setInterval(autoAdvance, 5000);

  // Pause auto-advance when user interacts with the slider
  testimonialSlider.addEventListener("mouseenter", () => {
    clearInterval(slideInterval);
  });

  // Resume auto-advance when user stops interacting
  testimonialSlider.addEventListener("mouseleave", () => {
    slideInterval = setInterval(autoAdvance, 5000);
  });

  // Touch events for swipe functionality on mobile
  testimonialSlider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    clearInterval(slideInterval);
  });

  testimonialSlider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    slideInterval = setInterval(autoAdvance, 5000);
  });

  function handleSwipe() {
    // Detect direction of swipe
    if (touchEndX < touchStartX) {
      // Swipe left, go to next slide
      const nextSlide = (currentSlide + 1) % testimonialCards.length;
      showSlide(nextSlide);
    } else if (touchEndX > touchStartX) {
      // Swipe right, go to previous slide
      const prevSlide =
        (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
      showSlide(prevSlide);
    }
  }

  // Initialize the first slide
  showSlide(0);

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      // Close mobile menu if open
      if (navMenu.classList.contains("show")) {
        navMenu.classList.remove("show");
        const icon = mobileMenuToggle.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Offset for the fixed header
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Sticky header effect
  const header = document.querySelector(".header");
  let lastScrollPosition = 0;

  window.addEventListener("scroll", () => {
    const currentScrollPosition = window.scrollY;

    if (currentScrollPosition > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    lastScrollPosition = currentScrollPosition;
  });

  // Animations on scroll
  const elementsToAnimate = document.querySelectorAll(
    ".feature-card, .feature-block, .step-card, .pricing-card, .testimonial-card"
  );

  function checkIfInView() {
    elementsToAnimate.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // If element is in viewport
      if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
        element.classList.add("visible");
      }
    });
  }

  // Check on initial load
  checkIfInView();

  // Check on scroll
  window.addEventListener("scroll", checkIfInView);
});
