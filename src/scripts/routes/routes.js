import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import SignupPage from "../pages/signup/signup-page";
import AddStoryPage from "../pages/add-story/add-story-page";
import LandingPage from "../pages/landing/index.js";  // pastikan ini sudah export instance
import LoginPage from "../pages/login/index.js"; // ✅ Bukan dari login-page.js

const routes = {
  "/": LandingPage,   // jangan new LandingPage()
  "/login": LoginPage,
  "/about": new AboutPage(),
  "/signup": new SignupPage(),
  "/home": new HomePage(),
  "/add-story": new AddStoryPage(),
};

export default routes;
