import AboutPage from "../pages/about/about-page";
import LandingPage from "../pages/landing/index.js"; 
import LoginPage from "../pages/login/index.js";
import SignupPage from "../pages/signup/index.js";
import HomePage from "../pages/home/index.js";
import AddStoryPage from "../pages/add-story/index.js";


const routes = {
  "/": LandingPage,
  "/login": LoginPage,
  "/signup": SignupPage,
  "/home": HomePage,
  "/about": new AboutPage(),
  "/add-story": AddStoryPage,
};

export default routes;
