import "../../../styles/signup.css";

const SignupView = {
  render() {
    return `
      <a href="#" class="skip-to-content" id="skip-to-content-link">Langsung sign up</a>

      <section id="signup-content" class="signup-page container" tabindex="-1">
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

      <!-- Loading Overlay -->
      <div id="loading-overlay" class="loading-hidden" aria-hidden="true">
        <div class="loading-popup">
          <div class="spinner"></div>
          <p>Memproses pendaftaran...</p>
        </div>
      </div>
    `;
  },

  bindEvents(signupHandler) {
    const skipLink = document.getElementById("skip-to-content-link");
    const signupSection = document.getElementById("signup-content");
    skipLink?.addEventListener("click", (e) => {
      e.preventDefault();
      signupSection.scrollIntoView({ behavior: "smooth" });
      signupSection.focus();
    });

    const form = document.getElementById("signup-form");
    const messageContainer = document.getElementById("signup-message");
    const loadingOverlay = document.getElementById("loading-overlay");

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;

      loadingOverlay.classList.remove("loading-hidden"); // Show loading
      await signupHandler(name, email, password, messageContainer, loadingOverlay);
    });
  }
};

export default SignupView;
