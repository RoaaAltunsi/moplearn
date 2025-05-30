import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
import { ToastContainer } from 'react-toastify';
import LoadingState from './components/UIStates/LoadingState.js';
import { useDispatch, useSelector } from 'react-redux';
import { clearAllErrors } from './redux/globalActions.js';
import { useEffect } from 'react';
import { getCategories } from './redux/slices/categorySlice.js';
import { getContributors } from './redux/slices/contributorSlice.js';
import { getLanguages } from './redux/slices/languageSlice.js';
import { persistor } from './redux/store.js';
import { checkAuthStatus } from './redux/slices/authSlice.js';

library.add(
  ...Object.values(solidIcons).filter(icon => icon.iconName),
  ...Object.values(brandIcons).filter(icon => icon.iconName),
  ...Object.values(regularIcons).filter(icon => icon.iconName)
);

function App() {

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category);
  const { languages } = useSelector((state) => state.language);
  const { contributors } = useSelector((state) => state.contributor);
  const isLoading = useSelector((state) =>
    Object.values(state).some(slice => slice.loading) // Check if any slice has loading = true
  );


  // Clear errors on route change
  useEffect(() => {
    dispatch(clearAllErrors());
  }, [location.pathname, dispatch]);

  // Fetch once when app loads >> static data
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
    if (languages.length === 0) {
      dispatch(getLanguages());
    }
    if (contributors.length === 0) {
      dispatch(getContributors());
    }
  }, [dispatch, contributors.length, categories.length, languages.length]);

  // Check session status if the frontend thinks the user is logged in
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(checkAuthStatus())
        .unwrap()
        .catch((err) => {
          if (err?.expired) {
            persistor.purge();
            navigate('/login');
          }
        });
    }
  }, [dispatch, isAuthenticated, navigate]);


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
