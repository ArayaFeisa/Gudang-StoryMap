import Api from "../../data/api";
import LoginView from "./login-view.js";

export default class LoginPresenter {
  async render() {
    return LoginView.render();
  }

  async afterRender() {
    const overlay = document.getElementById("loading-overlay");
    if (overlay) overlay.classList.add("loading-hidden");
    LoginView.bindEvents(this._handleLogin.bind(this));
  }

  async _handleLogin(email, password, messageElement, loadingOverlay) {
    try {
      const response = await Api.loginUser(email, password);
      if (!response.error) {
        localStorage.setItem("token", response.loginResult.token);
        window.location.hash = "/home";
      } else {
        messageElement.textContent = "Login gagal: " + response.message;
      }
    } catch (error) {
      messageElement.textContent = "Terjadi kesalahan saat login.";
    } finally {
      loadingOverlay.classList.add("loading-hidden");
    }
  }
}
