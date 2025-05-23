import Api from "../../data/api";
import SignupView from "./signup-view.js";

export default class SignupPresenter {
  async render() {
    return SignupView.render();
  }

  async afterRender() {
    SignupView.bindEvents(this._handleSignup.bind(this));
  }

  async _handleSignup(name, email, password, messageContainer) {
    try {
      const result = await Api.registerUser(name, email, password);

      if (!result.error) {
        messageContainer.innerHTML =
          '<p class="success">Akun berhasil dibuat. Silakan login.</p>';
        window.location.hash = "#/login";
      } else {
        messageContainer.innerHTML = `<p class="error">${result.message}</p>`;
      }
    } catch (error) {
      messageContainer.innerHTML =
        `<p class="error">Gagal mendaftar. Coba lagi.</p>`;
    }
  }
}
