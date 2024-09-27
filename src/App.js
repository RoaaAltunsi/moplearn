import { Route, Routes } from 'react-router-dom';
import './assets/styles/global.css';
import Homepage from './pages/Homepage/Homepage.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import Navbar from './components/Navbar/Navbar.js';

// Dynamically add all icons to the library
const iconList = Object.keys(Icons)
  .filter((key) => key !== 'fas' && key !== 'prefix')
  .map((icon) => Icons[icon]);
library.add(...iconList);

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route index element={<Homepage />} />
      </Routes>
    </div>
  );
}

export default App;
