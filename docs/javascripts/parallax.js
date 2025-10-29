// Parallax Demo Page JavaScript

(function() {
  'use strict';

  // Check if we're on the demo page
  if (!document.body.classList.contains('demo-page')) {
    return;
  }

  let rellaxInstance = null;

  // Initialize Rellax
  function initRellax() {
    if (typeof Rellax !== 'undefined') {
      rellaxInstance = new Rellax('.rellax', {
        speed: -2,
        center: false,
        wrapper: null,
        round: true,
        vertical: true,
        horizontal: false
      });
      console.log('Rellax initialized');
    } else {
      console.error('Rellax library not loaded');
    }
  }

  // Handle header transparency on scroll
  function handleHeaderScroll() {
    const header = document.querySelector('.md-header');
    if (!header) return;

    let lastScroll = 0;
    
    function onScroll() {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check
  }

  // Refresh Rellax on window resize
  function handleResize() {
    if (rellaxInstance) {
      rellaxInstance.refresh();
    }
  }

  // Initialize everything when DOM is ready
  function init() {
    // Wait for Rellax to load
    if (typeof Rellax === 'undefined') {
      // If CDN hasn't loaded yet, wait a bit
      setTimeout(initRellax, 100);
    } else {
      initRellax();
    }

    handleHeaderScroll();

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    }, { passive: true });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

