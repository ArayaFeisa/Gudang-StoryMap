import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/login/login-page";
import SignupPage from "../pages/signup/signup-page";
import AddStoryPage from "../pages/add-story/add-story-page";
import LandingPage from "../pages/landing/landing-page";

const routes = {
  "/": new LandingPage(),
  "/about": new AboutPage(),
  "/login": new LoginPage(),
  "/signup": new SignupPage(),
  "/home": new HomePage(),
  "/add-story": new AddStoryPage(),
};

export default routes;
