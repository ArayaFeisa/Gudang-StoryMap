import Api from "../../data/api.js";
import AuthModel from "../../data/auth-model.js";
import HomeView from "./home-view.js";

export default class HomePresenter {
  async render() {
    return HomeView.render();
  }

  async afterRender() {
    HomeView.bindEvents();

    const token = AuthModel.getToken();
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
