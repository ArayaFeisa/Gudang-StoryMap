import Api from "../../data/api";
import "../../../styles/home-page.css";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default class HomePage {
  async render() {
    return `
      <section class="container" id="home-container">
        <h2>Story Terbaru</h2>
        <div id="story-list" class="story-list"></div>
        <div id="map" style="height: 400px; margin-top: 2rem;"></div>
      </section>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem("token");
    const storyContainer = document.querySelector("#story-list");
    const mapContainer = document.querySelector("#map");
    const homeContainer = document.querySelector("#home-container");

    if (!token) {
      homeContainer.innerHTML = `
        <section style="text-align: center; padding: 40px 20px;">
          <h2 style="margin-bottom: 24px; font-size: 1.5rem;">
            Untuk mengakses beranda, silakan login terlebih dahulu!
          </h2>
          <a href="#/">
            <button style="font-size: 1rem; padding: 10px 20px;">
              Kembali ke Halaman Utama
            </button>
          </a>
        </section>
      `;
      return;
    }

    try {
      const { listStory } = await Api.getAllStories(token);

      storyContainer.innerHTML = listStory
        .map(
          (story) => `
        <div class="story-item">
          <img src="${story.photoUrl}" alt="${story.name}" class="story-img" />
          <div class="story-content">
            <h4>${story.name}</h4>
            <p>${story.description}</p>
            <small>${new Date(story.createdAt).toLocaleString()}</small>
          </div>
        </div>
      `,
        )
        .join("");

      const map = L.map(mapContainer).setView([0, 0], 2);
      // Menambahkan berbagai tile layer
      const streetsLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenStreetMap contributors",
        },
      );

      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
        },
      );

      const terrainLayer = L.tileLayer(
        "https://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg",
        {
          attribution:
            '&copy; <a href="https://stamen.com">Stamen Design</a> & <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>',
        },
      );

      // Menambahkan Layer Control
      L.control
        .layers(
          {
            Streets: streetsLayer,
            Satellite: satelliteLayer,
            Terrain: terrainLayer,
          },
          {},
          {
            collapsed: false,
          },
        )
        .addTo(map);

      streetsLayer.addTo(map);

      // Menentukan koordinat untuk menampilkan marker
      const coordinates = listStory
        .filter((story) => story.lat && story.lon)
        .map((story) => [story.lat, story.lon]);

      if (coordinates.length > 0) {
        const avgLat =
          coordinates.reduce((sum, coord) => sum + coord[0], 0) /
          coordinates.length;
        const avgLon =
          coordinates.reduce((sum, coord) => sum + coord[1], 0) /
          coordinates.length;
        map.setView([avgLat, avgLon], 10);
      }

      // Menambahkan marker untuk setiap story
      listStory.forEach((story) => {
        if (story.lat && story.lon) {
          const marker = L.marker([story.lat, story.lon]).addTo(map);
          marker.bindPopup(
            `<strong>${story.name}</strong><br>${story.description}`,
          );
        }
      });
    } catch (error) {
      storyContainer.innerHTML = "<p>Gagal memuat data stories.</p>";
      console.error("Error fetching stories:", error);
    }
  }
}
