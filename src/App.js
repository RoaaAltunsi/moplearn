import { Route, Routes } from 'react-router-dom';
import './assets/styles/global.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import Navbar from './components/navbar/Navbar.js';
import routes from './routes.js';
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
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
