import "../../../styles/add-story-page.css";

const AddStoryView = {
  render() {
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
  },
};

export default AddStoryView;
