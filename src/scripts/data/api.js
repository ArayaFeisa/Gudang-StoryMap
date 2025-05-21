import CONFIG from "../config";

const ENDPOINT = `${CONFIG.BASE_URL}`;

const Api = {
  async registerUser(name, email, password) {
    const response = await fetch(`${ENDPOINT}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  },

  async loginUser(email, password) {
    const response = await fetch(`${ENDPOINT}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async getAllStories(token) {
    const response = await fetch(`${ENDPOINT}/stories?location=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async postStory({ description, photo, lat, lon }, token) {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);
    if (lat && lon) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const response = await fetch(`${ENDPOINT}/stories`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return response.json();
  },
};

export default Api;
