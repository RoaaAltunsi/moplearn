import { Route, Routes } from 'react-router-dom';
import './assets/styles/global.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import Navbar from './components/navbar/Navbar.js';
import Homepage from './pages/homepage/Homepage.js';
import Signup from './pages/auth/Signup.js';
import Login from './pages/auth/Login.js';
import Contributors from './pages/contributors/Contributors.js';
import Footer from './components/footer/Footer.js';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import * as brandIcons from '@fortawesome/free-brands-svg-icons';

// Dynamically add all icons from solid and brands packs
const iconList = [
  ...Object.keys(solidIcons),
  ...Object.keys(brandIcons),
]
  .filter((key) => key !== 'fas' && key !== 'prefix') // Filter out internal FontAwesome properties
  .map((icon) => solidIcons[icon] || brandIcons[icon]);
library.add(...iconList);

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="contributors" element={<Contributors />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
