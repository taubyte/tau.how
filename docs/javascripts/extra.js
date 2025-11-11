// Extra JavaScript for Taubyte Documentation

// Google tag (gtag.js) loader + initialization
(function () {
  var GA_MEASUREMENT_ID = "G-DNTEPF6LZH";

  // If gtag already exists, don't inject again
  if (typeof window.gtag !== "undefined") {
    try {
      window.gtag("config", GA_MEASUREMENT_ID);
    } catch (e) {
      // noop
    }
    return;
  }

  // Inject the gtag.js script asynchronously and initialize on load
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
  s.onload = function () {
    window.dataLayer = window.dataLayer || [];
    function _gtag() {
      window.dataLayer.push(arguments);
    }
    // expose gtag globally
    window.gtag = window.gtag || _gtag;
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);
  };
  s.onerror = function () {
    console.warn("Failed to load gtag.js");
  };
  document.head.appendChild(s);
})();

// Initialize any custom functionality
document.addEventListener("DOMContentLoaded", function () {
  // Add copy button functionality (if not already provided by theme)
  console.log("Taubyte documentation loaded");

  // Override the edit button to point to tau.how documentation repository
  // while keeping the navbar repo link pointing to tau with stars/forks
  const editButtons = document.querySelectorAll(
    "a[title*='Edit'], a[title*='edit']"
  );
  editButtons.forEach((button) => {
    if (button.href && button.href.includes("github.com/taubyte/tau")) {
      // Replace tau with tau.how in the edit URL
      button.href = button.href.replace("taubyte/tau", "taubyte/tau.how");
    }
  });

  // Also handle Material for MkDocs specific edit links
  const materialEditLink = document.querySelector(".md-source__fact--edit a");
  if (
    materialEditLink &&
    materialEditLink.href.includes("github.com/taubyte/tau")
  ) {
    materialEditLink.href = materialEditLink.href.replace(
      "taubyte/tau",
      "taubyte/tau.how"
    );
  }

  // Handle Material for MkDocs view source links to point to tau.how
  const materialViewLink = document.querySelector(".md-source__fact--view a");
  if (
    materialViewLink &&
    materialViewLink.href.includes("github.com/taubyte/tau")
  ) {
    // Replace tau with tau.how and change /raw/ to /blob/ for proper viewing
    materialViewLink.href = materialViewLink.href
      .replace("taubyte/tau", "taubyte/tau.how")
      .replace("/raw/", "/blob/");
  }

  // Also handle view buttons with title attributes and /raw/ URLs
  const viewButtons = document.querySelectorAll(
    "a[title*='View'], a[title*='view']"
  );
  viewButtons.forEach((button) => {
    if (button.href && button.href.includes("github.com/taubyte/tau")) {
      // Replace tau with tau.how and change /raw/ to /blob/ for proper viewing
      button.href = button.href
        .replace("taubyte/tau", "taubyte/tau.how")
        .replace("/raw/", "/blob/");
    }
  });

  // Add any custom event listeners or functionality here

  // --- Simple Carousel ---
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll(".tb-carousel__slide"));
    const viewport = carousel.querySelector(".tb-carousel__viewport");
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");
    const dotsContainer = carousel.querySelector("[data-carousel-dots]");

    if (slides.length === 0) return;

    let active = Math.max(
      0,
      slides.findIndex((s) => s.classList.contains("is-active"))
    );

    // Preload images for faster display
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (img) {
        const pre = new Image();
        pre.src = img.src;
        // hint decoding to be async for smoother paint
        img.decoding = "async";
        // ensure high priority for first
        if (slide.classList.contains("is-active")) {
          img.loading = "eager";
          img.fetchPriority = "high";
        }
      }
    });

    // Build dots
    const dots = slides.map((_, idx) => {
      const dot = document.createElement("button");
      dot.className = "tb-carousel__dot" + (idx === active ? " is-active" : "");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
      dot.addEventListener("click", () => goTo(idx));
      dotsContainer.appendChild(dot);
      return dot;
    });

    function syncHeight() {
      const img = slides[active].querySelector("img");
      if (!img) return;
      if (!img.complete) {
        img.addEventListener("load", syncHeight, { once: true });
        return;
      }
      const width = viewport.clientWidth || img.naturalWidth;
      const ratio = img.naturalWidth
        ? img.naturalHeight / img.naturalWidth
        : img.height / img.width;
      if (ratio && isFinite(ratio)) {
        viewport.style.height = Math.max(10, Math.round(width * ratio)) + "px";
      }
    }

    function goTo(index) {
      slides[active].classList.remove("is-active");
      dots[active].classList.remove("is-active");
      active = (index + slides.length) % slides.length;
      slides[active].classList.add("is-active");
      dots[active].classList.add("is-active");
      syncHeight();
    }

    function next() {
      goTo(active + 1);
    }
    function prev() {
      goTo(active - 1);
    }

    nextBtn && nextBtn.addEventListener("click", next);
    prevBtn && prevBtn.addEventListener("click", prev);

    // Autoplay
    let timer = setInterval(next, 5000);
    carousel.addEventListener("mouseenter", () => clearInterval(timer));
    carousel.addEventListener("mouseleave", () => {
      timer = setInterval(next, 5000);
    });

    // Basic swipe support
    let startX = 0;
    carousel.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );
    carousel.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        dx < 0 ? next() : prev();
      }
    });

    // Initial height sync and on resize
    syncHeight();
    window.addEventListener("resize", syncHeight);
  });
});

// Custom functions for documentation
window.taubyteDocs = {
  // Utility functions for documentation
  highlightCode: function (element) {
    // Custom code highlighting if needed
  },

  trackAnalytics: function (event, data) {
    // Custom analytics tracking
    if (typeof gtag !== "undefined") {
      gtag("event", event, data || {});
    } else {
      console.warn("Google Analytics (gtag) is not available");
    }
  },

  trackPageView: function (pageName, pageLocation) {
    // Track custom page views
    if (typeof gtag !== "undefined") {
      gtag("event", "page_view", {
        page_title: pageName || document.title,
        page_location: pageLocation || window.location.href,
      });
    }
  },

  trackEvent: function (category, action, label, value) {
    // Track custom events with category, action, label, and value
    if (typeof gtag !== "undefined") {
      gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  },

  trackException: function (description, fatal) {
    // Track exceptions and errors
    if (typeof gtag !== "undefined") {
      gtag("event", "exception", {
        description: description,
        fatal: fatal || false,
      });
    }
  },
};
