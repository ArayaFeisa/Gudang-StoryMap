import Api from "../../data/api";
import "../../../styles/login.css";

export default class LoginPage {
  async render() {
    return `
      <button class="skip-to-content" id="skip-button">Lewati ke konten login</button>
      <section id="login-section" class="login-page container" tabindex="-1">
        <div class="login-wrapper">
          <div class="login-form-container">
            <h2>Login</h2>
            <form id="login-form">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required />
  
              <label for="password">Password:</label>
              <input type="password" id="password" name="password" required minlength="8" />
  
              <button type="submit">Login</button>
            </form>
            <p id="login-message"></p>
            <p>Belum punya akun? <a href="#/signup">Daftar di sini</a></p>
          </div>
          <div class="login-logo-container">
            <img src="/images/inilogo.png" alt="Logo" class="login-logo" />
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById("login-form");
    const message = document.getElementById("login-message");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = form.email.value;
      const password = form.password.value;

      try {
        const response = await Api.loginUser(email, password);
        if (!response.error) {
          localStorage.setItem("token", response.loginResult.token);
          window.location.hash = "/home";
        } else {
          message.textContent = "Login gagal: " + response.message;
        }
      } catch (error) {
        message.textContent = "Terjadi kesalahan saat login.";
      }
    });

    // Skip to content
    const skipButton = document.getElementById("skip-button");
    const loginSection = document.getElementById("login-section");

    skipButton.addEventListener("click", (e) => {
      e.preventDefault();
      loginSection.focus();
      loginSection.scrollIntoView({ behavior: "smooth" });
    });
  }
}
