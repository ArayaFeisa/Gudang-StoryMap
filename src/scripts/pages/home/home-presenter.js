import Api from "../../data/api.js";
import HomeView from "./home-view.js";

export default class HomePresenter {
  async render() {
    return HomeView.render();
  }

  async afterRender() {
    HomeView.bindEvents();

    const token = localStorage.getItem("token");
    if (!token) {
      HomeView.showUnauthorizedMessage();
      return;
    }

    try {
      const { listStory } = await Api.getAllStories(token);
      HomeView.renderStories(listStory);
      HomeView.renderMap(listStory);
    } catch (error) {
      HomeView.showErrorMessage();
    }
  }
}
