import Api from "../../data/api";
import "../../../styles/signup.css";

export default class SignupPage {
  async render() {
    return `
          <section class="signup-page container">
            <div class="signup-wrapper">
              <div class="signup-form-container">
                <h2>Daftar Akun</h2>
                <form id="signup-form" class="auth-form">
                  <input type="text" id="name" placeholder="Nama Lengkap" required />
                  <input type="email" id="email" placeholder="Email" required />
                  <input type="password" id="password" placeholder="Password (min. 8 karakter)" required />
                  <button type="submit">Daftar</button>
                </form>
                <p>Sudah punya akun? <a href="#/login">Masuk di sini</a></p>
                <div id="signup-message"></div>
              </div>
              <div class="signup-logo-container">
                <img src="/images/inilogo.png" alt="Logo Aplikasi" class="signup-logo" />
              </div>
            </div>
          </section>
        `;
  }

  async afterRender() {
    const form = document.querySelector("#signup-form");
    const messageContainer = document.querySelector("#signup-message");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.querySelector("#name").value;
      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;

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
        messageContainer.innerHTML = `<p class="error">Gagal mendaftar. Coba lagi.</p>`;
      }
    });
  }
}
