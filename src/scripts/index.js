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
    logoutItem.style.display = token ? "block" : "none";
  };

  toggleLogoutButton();

  logoutButton?.addEventListener("click", () => {
    localStorage.removeItem("token");
    toggleLogoutButton();
    window.location.hash = "/login";
  });

  const renderWithTransition = async () => {
    const main = document.querySelector("#main-content");

    if (document.startViewTransition && main) {
      await document.startViewTransition(async () => {
        await app.renderPage();
        toggleLogoutButton();
      });
    } else {
      await app.renderPage();
      toggleLogoutButton();
    }
  };

  await renderWithTransition();

  window.addEventListener("hashchange", async () => {
    await renderWithTransition();
  });
});
