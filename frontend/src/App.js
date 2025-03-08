import { Route, Routes, useLocation } from 'react-router-dom';
import './assets/styles/global.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import Navbar from './components/navbar/Navbar.js';
import routes from './routes.js';
import Footer from './components/footer/Footer.js';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import * as brandIcons from '@fortawesome/free-brands-svg-icons';
import * as regularIcons from '@fortawesome/free-regular-svg-icons';
import ScrollToTop from './utils/ScrollToTop.js';
import PageWrapper from './utils/PageWrapper.js';
import { toast, ToastContainer } from 'react-toastify';
import LoadingState from './components/UIStates/LoadingState.js';
import { useDispatch, useSelector } from 'react-redux';
import { clearAllErrors } from './redux/globalActions.js';
import { useEffect } from 'react';

library.add(
  ...Object.values(solidIcons).filter(icon => icon.iconName),
  ...Object.values(brandIcons).filter(icon => icon.iconName),
  ...Object.values(regularIcons).filter(icon => icon.iconName)
);

function App() {

  const location = useLocation();
  const dispatch = useDispatch();

  // Track loading state from all slices
  const isLoading = useSelector((state) =>
    Object.values(state).some(slice => slice.loading) // Check if any slice has loading = true
  );

  // Track error state from all slices
  const errors = useSelector((state) =>
    Object.entries(state)
      .map(([_, slice]) => slice.error) // Extract error messages
      .filter(error => error) // Remove null/undefined errors
  );
  

  // Show toast notifications for errors
  useEffect(() => {
    errors.forEach((error) => {
      toast.error(error);
    });

  }, [errors, dispatch]);

  // Clear errors on route change
  useEffect(() => {
    dispatch(clearAllErrors());
  }, [location.pathname, dispatch]);
  

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <PageWrapper>
        {isLoading && <LoadingState />}
        <ToastContainer />

        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </PageWrapper>
      <Footer />
    </>
  );
}

export default App;
