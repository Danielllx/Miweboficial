
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const mainContent = document.getElementById("main-content");
  if (loader && mainContent) {
    setTimeout(() => {
      loader.style.display = "none";
      mainContent.classList.remove("hidden");
    }, 2200);
  }
});
