import Api from "../../data/api";
import "leaflet/dist/leaflet.css";
import "../../../styles/add-story-page.css";
import L from "leaflet";

export default class AddStoryPage {
  async render() {
    const token = localStorage.getItem("token");

    if (!token) {
      return `
        <section class="container" style="text-align: center; padding: 40px 20px;" id="add-story-container" tabindex="-1">
          <h2 style="margin-bottom: 24px; font-size: 1.5rem;">
            Untuk menambahkan story, silakan login terlebih dahulu!
          </h2>
          <a href="#/">
            <button class="btn-back" style="font-size: 1rem; padding: 10px 20px;">
              Kembali ke Halaman Utama
            </button>
          </a>
        </section>
      `;
    }

    return `
      <a href="#add-story-container" class="skip-to-content">Langsung ke tambah story</a>
      <section class="container" id="add-story-container" tabindex="-1">
        <h2>Tambah Story Baru</h2>
        <form id="add-story-form">
          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" required></textarea>
          </div>
          <div class="form-group">
            <label>Ambil Foto</label>
            <video id="camera" autoplay playsinline width="300"></video>
            <button type="button" id="take-photo">Jepret</button>
            <label>Atau Pilih Gambar dari Galeri</label>
            <input type="file" id="photo-file" accept="image/*" />
            <label>Preview Gambar</label>
            <canvas id="snapshot" width="300" height="200" style="display:none;"></canvas>
          </div>
          <div class="form-group">
            <label for="map">Pilih Lokasi</label>
            <div id="map" style="height: 300px;"></div>
          </div>
          <button type="submit" class="submit-btn">Kirim</button>
        </form>
        <div id="message"></div>
      </section>
    `;
  }

  async afterRender() {
    const skipLink = document.querySelector(".skip-to-content");
    skipLink?.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById("add-story-container");
      if (target) target.focus();
    });

    const token = localStorage.getItem("token");
    if (!token) return;

    const video = document.querySelector("#camera");
    const canvas = document.querySelector("#snapshot");
    const takePhotoBtn = document.querySelector("#take-photo");
    const context = canvas.getContext("2d");
    const photoFileInput = document.querySelector("#photo-file");
    let capturedBlob = null;
    let currentLat = null;
    let currentLon = null;
    let cameraStream = null;

    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = cameraStream;
    } catch (err) {
      const messageElement = document.querySelector("#message");
      if (messageElement) messageElement.innerText = "Gagal mengakses kamera.";
    }

    // Ambil foto
    takePhotoBtn.addEventListener("click", () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        capturedBlob = blob;
      }, "image/jpeg");
      canvas.style.display = "block";
    });

    // Upload file
    photoFileInput.addEventListener("change", () => {
      const file = photoFileInput.files[0];
      if (file) {
        capturedBlob = file;

        const reader = new FileReader();
        reader.onload = function (e) {
          const img = new Image();
          img.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.style.display = "block";
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // Peta
    const map = L.map("map").setView([-6.2, 106.8], 10);
    const streetsLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    });
    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
      }
    );
    const terrainLayer = L.tileLayer("https://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg", {
      attribution:
        '&copy; <a href="https://stamen.com">Stamen Design</a> & <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>',
    });

    L.control.layers(
      {
        Streets: streetsLayer,
        Satellite: satelliteLayer,
        Terrain: terrainLayer,
      }
    ).addTo(map);

    streetsLayer.addTo(map);

    let marker = null;
    map.on("click", (e) => {
      currentLat = e.latlng.lat;
      currentLon = e.latlng.lng;

      if (marker) map.removeLayer(marker);
      marker = L.marker([currentLat, currentLon]).addTo(map);
    });

    // Submit
    document.querySelector("#add-story-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const description = document.querySelector("#description").value;

      if (!capturedBlob) {
        document.querySelector("#message").innerText =
          "Harap ambil atau unggah foto terlebih dahulu.";
        return;
      }

      try {
        const response = await Api.postStory(
          {
            description,
            photo: capturedBlob,
            lat: currentLat,
            lon: currentLon,
          },
          token
        );

        if (response.error) throw new Error(response.message);

        document.querySelector("#message").innerText = "Story berhasil ditambahkan!";
        if (cameraStream) cameraStream.getTracks().forEach((track) => track.stop());
        window.location.hash = "/home";
      } catch (err) {
        document.querySelector("#message").innerText =
          `Gagal menambahkan story: ${err.message}`;
      }
    });

    // Matikan kamera saat pindah halaman
    const stopCamera = () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };

    window.addEventListener("hashchange", stopCamera);
    window.onbeforeunload = stopCamera;

    const originalPushState = history.pushState;
    history.pushState = (...args) => {
      stopCamera();
      originalPushState.apply(history, args);
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = (...args) => {
      stopCamera();
      originalReplaceState.apply(history, args);
    };
  }
}
