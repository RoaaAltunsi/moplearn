import Homepage from './pages/homepage/Homepage.js';
import Signup from './pages/auth/Signup.js';
import Login from './pages/auth/Login.js';
import ResetPassword from './pages/auth/ResetPassword.js';
import Contributors from './pages/contributors/Contributors.js';
import ContributeForm from './pages/contributeForm/ContributeForm.js';
import Courses from './pages/courses/Courses.js';
import CourseCategory from './pages/courseCategory/CourseCategory.js';
import FindPartner from './pages/findPartner/FindPartner.js';
import AboutUs from './pages/aboutUs/AboutUs.js';
import Profile from './pages/profile/Profile.js';
import PartnersRequests from './pages/partnersRequests/PartnersRequests.js';
import EditAccount from './pages/editAccount/EditAccount.js';

const routes = [
  { path: "/", element: <Homepage />, index: true }, // Default route
  { path: "signup", element: <Signup /> },
  { path: "login", element: <Login /> },
  { path: "reset-password", element: <ResetPassword /> },
  { path: "contributors", element: <Contributors /> },
  { path: "contribute-form", element: <ContributeForm /> },
  { path: "courses", element: <Courses /> },
  { path: "courses/:courseCategory", element: <CourseCategory /> }, // Dynamic route
  { path: "find-partner/:courseTitle?", element: <FindPartner /> }, // Optional sub-route
  { path: "about-us", element: <AboutUs /> },
  { path: "profile/:username", element: <Profile /> },
  { path: "partners-requests", element: <PartnersRequests /> },
  { path: "edit-account", element: <EditAccount /> },
];

export default routes;