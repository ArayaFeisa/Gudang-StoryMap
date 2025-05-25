import Api from "../../data/api";
import L from "leaflet";

const AddStoryPresenter = {
  bindEvent() {
    const skipLink = document.querySelector(".skip-to-content");
    skipLink?.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("add-story-container")?.focus();
    });

    const token = localStorage.getItem("token");
    if (!token) return;

    const video = document.querySelector("#camera");
    const canvas = document.querySelector("#snapshot");
    const context = canvas.getContext("2d");
    const takePhotoBtn = document.querySelector("#take-photo");
    const photoFileInput = document.querySelector("#photo-file");
    const message = document.querySelector("#message");
    const loadingOverlay = document.querySelector("#loading-overlay");

    let capturedBlob = null;
    let currentLat = null;
    let currentLon = null;
    let cameraStream = null;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        cameraStream = stream;
        video.srcObject = stream;
      })
      .catch(() => {
        message.innerText = "Gagal mengakses kamera.";
      });

    takePhotoBtn.addEventListener("click", () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        capturedBlob = blob;
      }, "image/jpeg");
      canvas.style.display = "block";
    });

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

    const map = L.map("map").setView([-6.2, 106.8], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    let marker = null;
    map.on("click", (e) => {
      currentLat = e.latlng.lat;
      currentLon = e.latlng.lng;
      if (marker) map.removeLayer(marker);
      marker = L.marker([currentLat, currentLon]).addTo(map);
    });

    const addStoryForm = document.querySelector("#add-story-form");
    addStoryForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const description = document.querySelector("#description").value;

      if (!capturedBlob) {
        message.innerText = "Harap ambil atau unggah foto terlebih dahulu.";
        return;
      }

      loadingOverlay?.classList.remove("loading-hidden");

      try {
        const response = await Api.postStory(
          {
            description,
            photo: capturedBlob,
            lat: currentLat,
            lon: currentLon,
          },
          token,
        );

        if (response.error) throw new Error(response.message);

        message.innerText = "Story berhasil ditambahkan!";
        if (cameraStream)
          cameraStream.getTracks().forEach((track) => track.stop());
        window.location.hash = "/home";
      } catch (err) {
        message.innerText = `Gagal menambahkan story: ${err.message}`;
      } finally {
        loadingOverlay?.classList.add("loading-hidden");
      }
    });

    const stopCamera = () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };

    window.addEventListener("hashchange", stopCamera);
    window.onbeforeunload = stopCamera;
  },
};

export default AddStoryPresenter;
