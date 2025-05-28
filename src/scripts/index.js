// CSS imports
import "../styles/styles.css";

import App from "./pages/app";
import AuthModel from "./data/auth-model.js";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  const logoutButton = document.querySelector("#logout-button");
  const logoutItem = document.querySelector("#logout-item");
  const skipLink = document.querySelector(".skip-to-content");
  const mainContent = document.querySelector("#main-content");

  const toggleLogoutButton = () => {
    const token = AuthModel.getToken();
    logoutItem.style.display = token ? "block" : "none";
  };

  const handleSkipToContent = () => {
    if (!skipLink || !mainContent) return;

    skipLink.addEventListener("click", (e) => {
  e.preventDefault();

  mainContent.scrollIntoView({ behavior: "smooth", block: "start" });
  mainContent.focus();

  skipLink.blur();

  mainContent.classList.add("highlight-focus");

  setTimeout(() => {
    mainContent.classList.remove("highlight-focus");
  }, 2000);
});

  };

  const renderWithTransition = async () => {
    if (document.startViewTransition && mainContent) {
      await document.startViewTransition(async () => {
        await app.renderPage();
        toggleLogoutButton();
      });
    } else {
      await app.renderPage();
      toggleLogoutButton();
    }
  };

  // Logout
  logoutButton?.addEventListener("click", () => {
    AuthModel.removeToken();
    toggleLogoutButton();
    window.location.hash = "/login";
  });

  handleSkipToContent();
  await renderWithTransition();

  window.addEventListener("hashchange", async () => {
    await renderWithTransition();
  });
});
