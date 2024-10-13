import Homepage from './pages/homepage/Homepage.js';
import Signup from './pages/auth/Signup.js';
import Login from './pages/auth/Login.js';
import ResetPassword from './pages/auth/ResetPassword.js';
import Contributors from './pages/contributors/Contributors.js';
import ContributeForm from './pages/contributeForm/ContributeForm.js';

const routes = [
  { path: "/", element: <Homepage />, index: true }, // Default route
  { path: "signup", element: <Signup /> },
  { path: "login", element: <Login /> },
  { path: "reset-password", element: <ResetPassword /> },
  { path: "contributors", element: <Contributors /> },
  { path: "contribute-form", element: <ContributeForm /> },
];

export default routes;