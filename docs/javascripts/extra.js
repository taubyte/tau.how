// Extra JavaScript for Taubyte Documentation

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

  // Add any custom event listeners or functionality here
});

// Custom functions for documentation features
window.taubyteDocs = {
  // Utility functions for documentation
  highlightCode: function (element) {
    // Custom code highlighting if needed
  },

  trackAnalytics: function (event, data) {
    // Custom analytics tracking if needed
  },
};
