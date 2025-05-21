import "../../../styles/landing-page.css";

export default class LandingPage {
  async render() {
    return `
        <section class="landing container">
          <div class="landing-text">
            <h1>Selamat Datang di Gudang StoryMap!</h1>
            <button id="start-button" class="start-button">Mulai</button>
          </div>
          <img src="/images/inilogo.png" alt="Logo StoryMap" class="landing-image" />
        </section>
      `;
  }

  async afterRender() {
    document.querySelector("#start-button").addEventListener("click", () => {
      window.location.hash = "/login";
    });
  }
}
