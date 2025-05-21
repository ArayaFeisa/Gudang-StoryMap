// CSS imports
import "../styles/styles.css";

import App from "./pages/app";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  const logoutButton = document.querySelector("#logout-button");
  const logoutItem = document.querySelector("#logout-item");

  const toggleLogoutButton = () => {
    const token = localStorage.getItem("token");
    if (token) {
      logoutItem.style.display = "block";
    } else {
      logoutItem.style.display = "none";
    }
  };

  toggleLogoutButton();

  logoutButton?.addEventListener("click", () => {
    localStorage.removeItem("token");
    logoutItem.style.display = "none";
    window.location.hash = "/login";
  });

  // Menambah view transition
  if (document.startViewTransition) {
    document.startViewTransition(async () => {
      await app.renderPage();
    });
  } else {
    await app.renderPage();
  }

  window.addEventListener("hashchange", async () => {
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        await app.renderPage();
        toggleLogoutButton();
      });
    } else {
      await app.renderPage();
      toggleLogoutButton();
    }
  });
});
