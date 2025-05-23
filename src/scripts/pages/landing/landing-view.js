import "../../../styles/landing-page.css";

const LandingView = {
  render() {
    return `
      <a href="#" class="skip-to-content" id="skip-to-content-link">Langsung ke konten utama</a>

      <main id="landing-main" class="landing container" tabindex="-1">
        <div class="landing-text">
          <h1>Selamat Datang di Gudang StoryMap!</h1>
          <button id="start-button" class="start-button" aria-label="Mulai menggunakan aplikasi StoryMap">
            Mulai
          </button>
        </div>
        <img src="/images/inilogo.png" alt="Logo Gudang StoryMap" class="landing-image" />
      </main>
    `;
  },

  bindEvents() {
    const skipLink = document.getElementById("skip-to-content-link");
    const landingMain = document.getElementById("landing-main");

    skipLink?.addEventListener("click", (e) => {
      e.preventDefault();
      landingMain.scrollIntoView({ behavior: "smooth" });
      landingMain.focus();
    });

    document.getElementById("start-button")?.addEventListener("click", () => {
      window.location.hash = "/login";
    });
  }
};

export default LandingView;
