// Auto-dismiss form error messages after a few seconds
document.addEventListener("DOMContentLoaded", () => {
  const errorBox = document.querySelector(".form-error");
  if (errorBox) {
    setTimeout(() => {
      errorBox.style.transition = "opacity 0.4s ease";
      errorBox.style.opacity = "0";
      setTimeout(() => errorBox.remove(), 400);
    }, 5000);
  }
});

// Highlight the active sidebar link based on current URL
// (backup in case a page forgets to pass `currentPage` to the sidebar partial)
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  document.querySelectorAll(".sidebar-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && currentPath.startsWith(href) && href !== "/") {
      link.classList.add("active");
    }
  });
});

// Simple confirm-before-delete helper, for any delete form
// that doesn't already have an inline onsubmit confirm
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form.confirm-delete").forEach((form) => {
    form.addEventListener("submit", (e) => {
      const message =
        form.dataset.confirmMessage || "Are you sure you want to delete this?";
      if (!confirm(message)) {
        e.preventDefault();
      }
    });
  });
});
