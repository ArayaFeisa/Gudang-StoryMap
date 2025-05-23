import "../../../styles/login.css";

const LoginView = {
  render() {
    return `
      <button class="skip-to-content" id="skip-button">Langsung login</button>
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
  },

  bindEvents(loginHandler) {
    const form = document.getElementById("login-form");
    const message = document.getElementById("login-message");

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = form.email.value;
      const password = form.password.value;
      loginHandler(email, password, message);
    });

    const skipButton = document.getElementById("skip-button");
    const loginSection = document.getElementById("login-section");

    skipButton?.addEventListener("click", (e) => {
      e.preventDefault();
      loginSection.focus();
      loginSection.scrollIntoView({ behavior: "smooth" });
    });
  }
};

export default LoginView;
