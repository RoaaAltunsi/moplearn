import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import styles from './Navbar.module.css';
import Logo from '../../assets/images/Logo.png';
import DefaultImg from '../../assets/images/default-profile.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import slugify from "slugify";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { persistor } from "../../redux/store";
import { toast, ToastContainer } from "react-toastify";
import LoadingState from "../UIStates/LoadingState";

const navSections = [
   { label: "Home", link: "/" },
   { label: "Courses", link: "/courses" },
   { label: "Find Partner", link: "/find-partner" },
   { label: 'Contributors', link: "/contributors" }
];

// ---------- Reusable NavItem component ----------
const NavItem = ({ item, icon, onClick = () => { } }) => (
   <li className={styles.nav_item}>
      <NavLink
         className={({ isActive }) =>
            `${styles.nav_link} ${isActive ? styles.active : ''}`
         }
         to={item.link}
         onClick={onClick}
      >
         {icon && (<FontAwesomeIcon icon={icon} className={styles.nav_item_icon} />)}
         {item.label}
      </NavLink>
   </li>
);

// --------------- Main navbar list ---------------
const MainNavList = ({ onClick = () => { } }) => (
   <ul className={`${styles.flex_row} ${styles.main_list}`}>
      {navSections.map((item, index) => (
         <NavItem key={index} item={item} onClick={onClick} />
      ))}
   </ul>
);


// ------- Signup/Login container component -------
const AuthButtons = ({
   onClickSignup = () => { },
   onClickLogin = () => { }
}) => (
   <div className={styles.auth_container}>
      <button className={styles.nav_button} onClick={onClickSignup}>
         Sign Up
      </button>

      <button className={styles.nav_button} onClick={onClickLogin}>
         Log In
      </button>
   </div>
);

// ----------- Dropdown list conponent ------------
const PopUpList = forwardRef(({ isVisible, width, items, onClose }, ref) => (
   <ul
      ref={ref}
      className={`${styles.popup_list} ${isVisible ? styles.visible : ''}`}
      style={{ width: width }}
   >
      {items.map((item, index) => (
         <NavItem
            key={index}
            item={{
               label: item.label,
               link: item.link
            }}
            icon={item.icon}
            onClick={(e) => {
               if (item.action) {
                  e.preventDefault();
                  item.action(); // Call the action
               }
               onClose(); // Close the popup after clicking
            }}
         />
      ))}
   </ul>
));

function Navbar() {

   const navigate = useNavigate();
   const dispatch = useDispatch();
   const location = useLocation(); // Get the current route
   const coursesIconRef = useRef(null);
   const mobileMenuRef = useRef(null);
   const coursesListRef = useRef(null);
   const coursesDropMenu = useRef(null);
   const dtUserProfileRef = useRef(null); // User icon in desktop sizes
   const mbUserProfileRef = useRef(null); // User icon in mobile sizes
   const dtProfileDropRef = useRef(null);
   const mbProfileDropRef = useRef(null);
   const [isMenuOpened, setIsMenuOpened] = useState(false); // Navbar in tablet/mobile mode
   const [hiddenCourses, setHiddenCourses] = useState([]);
   const [isCoursesDropMenuOpened, setIsCoursesDropMenuOpened] = useState(false);
   const [isProfileDtDropOpened, setIsProfileDtDropOpened] = useState(false);
   const [isProfileMbDropOpened, setIsProfileMbDropOpened] = useState(false);
   const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
   const { categories } = useSelector((state) => state.category);

   // ---------- List of Courses Categories ----------
   const CoursesList = forwardRef(({ onClick = () => { } }, ref) => (
      <ul ref={ref || null} className={styles.courses_list}>
         {categories.map((item) => (
            <NavItem
               key={item.id}
               item={{
                  label: item.title,
                  link: `/courses/${item.id}-${slugify(item.title, { lower: true })}` // Dynamically generate the link
               }}
               onClick={onClick}
            />
         ))}
      </ul>
   ));


   // ---------- Close menu when clicking outside the component ----------
   const handleClickOutside = useCallback((e) => {
      // Helper function to check if the click is inside any element
      const isClickInside = (refs) => refs.some(ref => ref?.current?.contains(e.target));
      // Define the refs to ignore clicks for
      const ignoreRefs = [coursesIconRef, dtUserProfileRef, mbUserProfileRef];
      if (isClickInside(ignoreRefs)) return;

      if (isMenuOpened && mobileMenuRef?.current && !mobileMenuRef.current.contains(e.target)) {
         setIsMenuOpened(false);
         setIsProfileMbDropOpened(false);
      }
      if (isCoursesDropMenuOpened && coursesDropMenu?.current && !coursesDropMenu.current.contains(e.target)) {
         setIsCoursesDropMenuOpened(false);
      }
      if (isProfileDtDropOpened && dtProfileDropRef?.current && !dtProfileDropRef.current.contains(e.target)) {
         setIsProfileDtDropOpened(false);
      }
      if (isProfileMbDropOpened && mbProfileDropRef?.current && !mbProfileDropRef.current.contains(e.target)) {
         setIsProfileMbDropOpened(false);
      }
   }, [isCoursesDropMenuOpened, isProfileDtDropOpened, isMenuOpened, isProfileMbDropOpened]);

   // ---------- Update hidden courses based on container width ----------
   const updateHiddenCourses = useCallback(() => {
      if (!coursesListRef?.current) return;

      const coursesUlWidth = coursesListRef.current.getBoundingClientRect().width;
      const coursesLiElements = coursesListRef.current.children;
      let totalWidth = 0;
      const newHiddenCourses = [];

      Array.from(coursesLiElements).forEach((item, index) => {
         totalWidth += item.getBoundingClientRect().width;
         if (parseInt(totalWidth) > coursesUlWidth) {
            newHiddenCourses.push(categories[index].title);
         }
      });
      setHiddenCourses(newHiddenCourses);
   }, [coursesListRef, categories]);

   // ---------------- Logout user and clear global state ----------------
   const handleLogout = async () => {
      try {
         await dispatch(logout()).unwrap();
         persistor.purge(); // Clear persisted data
         window.location.href = "/";
      } catch (error) {
         toast.error(error?.error);
      }
   }

   // ------------- Update courses list only in custom routes ------------
   useEffect(() => {
      const isCourseCategoryPage = /^\/courses(\/[^/]*)?$/.test(location.pathname);

      if (isCourseCategoryPage) {
         // Wait for the browser to update the layout and then update the visible courses
         requestAnimationFrame(() => {
            updateHiddenCourses();
         })
         window.addEventListener('resize', updateHiddenCourses);
      }
      return () => {
         window.removeEventListener('resize', updateHiddenCourses);
      };
   }, [location.pathname, updateHiddenCourses]);

   // -------------- Handle clicking outside the opened menu --------------
   useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [handleClickOutside]);

   // ------- Prevent scrolling when mobile menu is opened ------------
   useEffect(() => {
      if (isMenuOpened) {
         document.body.classList.add('no_scroll');
      } else {
         document.body.classList.remove('no_scroll');
      }
   }, [isMenuOpened]);

   // ----- Ensure each menu only appears in its designed window size -----
   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth > 768) {
            setIsMenuOpened(false);
            setIsProfileMbDropOpened(false);
         } else {
            setIsCoursesDropMenuOpened(false);
            setIsProfileDtDropOpened(false);
         }
      }
      window.addEventListener('resize', handleResize);

      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, []);


   return (
      <nav className={styles.navbar}>
         {loading && <LoadingState />}

         <ToastContainer />

         {/* ---------------------- Main Nav Section ---------------------- */}
         <div className={styles.main_section}>
            <div className={styles.flex_row}>
               {/* Hamburger icon for tablet/mobile mode */}
               <FontAwesomeIcon
                  icon="fa-solid fa-bars"
                  onClick={() => setIsMenuOpened(true)}
                  className={styles.icon}
               />
               {/* Logo */}
               <Link to="/">
                  <img src={Logo} alt="Loog" className={styles.logo} />
               </Link>
            </div>

            {/* Main nav list container */}
            <div className={styles.nav_links_container}>
               <MainNavList />

               {isAuthenticated ? (
                  <>
                     {/* User's account list */}
                     <div className={`${styles.flex_row} ${styles.user_logged}`}>
                        <FontAwesomeIcon
                           icon="fa-solid fa-comment-dots"
                           className={styles.icon}
                           onClick={() => console.log("Chat")}
                        />
                        <FontAwesomeIcon
                           icon="fa-solid fa-user-group"
                           className={styles.icon}
                           onClick={() => navigate('partners-requests')}
                        />
                        <div
                           ref={dtUserProfileRef}
                           className={styles.profile_pic}
                           onClick={() => setIsProfileDtDropOpened(!isProfileDtDropOpened)}
                        >
                           <div className={styles.img_container}>
                              <img src={DefaultImg} alt="" />
                           </div>
                           <FontAwesomeIcon icon="fa-solid fa-caret-down" />
                        </div>
                     </div>

                     {/* User's profile dropdown menu */}
                     <PopUpList
                        ref={dtProfileDropRef}
                        isVisible={isProfileDtDropOpened}
                        width='15vw'
                        items={[
                           { label: 'Profile', link: `/profile/${user.username}`, icon: 'fa-solid fa-user' },
                           { label: 'Settings', link: '/edit-account?tab=settings', icon: 'fa-solid fa-gear' },
                           { label: 'Log Out', link: '', icon: 'fa-solid fa-arrow-right-from-bracket', action: handleLogout }
                        ]}
                        onClose={() => setIsProfileDtDropOpened(false)}
                     />
                  </>

               ) : (
                  <>
                     {/* Sign up / Log in buttons */}
                     <AuthButtons
                        onClickSignup={() => {
                           navigate('signup');
                           setIsMenuOpened(false);
                        }}
                        onClickLogin={() => {
                           navigate('login');
                           setIsMenuOpened(false);
                        }}
                     />
                  </>
               )}
            </div>
         </div>

         {/* --------------------- Courses Nav Section -------------------- */}
         <div className={`
                  ${styles.courses_section}
                  ${location.pathname.startsWith('/courses') ? styles.visible : ''}
               `}
         >
            <div className={styles.nav_links_container}>
               <CoursesList ref={coursesListRef} />

               <FontAwesomeIcon
                  ref={coursesIconRef}
                  icon="fa-solid fa-ellipsis-vertical"
                  onClick={() => setIsCoursesDropMenuOpened(!isCoursesDropMenuOpened)}
                  className={`
                     ${styles.icon}
                     ${hiddenCourses.length > 0 ? styles.visible : ''}
                  `}
               />
            </div>
         </div>

         {/* -- Drop down menu if courses exceed the available nav width -- */}
         <PopUpList
            ref={coursesDropMenu}
            isVisible={hiddenCourses.length > 0 && isCoursesDropMenuOpened}
            width='20vw'
            items={hiddenCourses.map(course => ({
               label: course,
               link: `/courses/${slugify(course, { lower: true })}` // Dynamically generate the link
            }))}
            onClose={() => setIsCoursesDropMenuOpened(false)}
         />

         {/* ----------- Hamburger's Menu for Tablet/Mobile Mode ---------- */}
         <div>
            {/* Transparent background */}
            {isMenuOpened && (
               <div className={styles.transparent_background} />
            )}

            {/* Hamburger's menu container */}
            <div
               ref={mobileMenuRef}
               className={`${styles.hamburger_menu} ${isMenuOpened ? styles.menu_opened : ''}`}
            >
               {/* Logo && Close icon */}
               <div className={styles.header}>
                  <Link to="/">
                     <img src={Logo} alt="Loog" className={styles.logo} />
                  </Link>
                  <FontAwesomeIcon
                     icon="fa-solid fa-xmark"
                     className={styles.icon}
                     onClick={() => setIsMenuOpened(false)}
                  />
               </div>

               {/* Main nav list items */}
               <MainNavList onClick={() => setIsMenuOpened(false)} />

               {location.pathname.startsWith('/courses') && (
                  <CoursesList onClick={() => setIsMenuOpened(false)} />
               )}

               {isAuthenticated ? (
                  <>
                     {/* User's account picture */}
                     <div className={styles.auth_container}>
                        <div
                           ref={mbUserProfileRef}
                           className={`${styles.flex_row} ${styles.user_logged}`}
                           onClick={() => setIsProfileMbDropOpened(!isProfileMbDropOpened)}
                        >
                           <div className={styles.img_container}>
                              <img src={DefaultImg} alt="" />
                           </div>
                           <h3> Ola Saber </h3>
                        </div>
                     </div>

                     {/* User's account popup menu */}
                     <PopUpList
                        ref={mbProfileDropRef}
                        isVisible={isProfileMbDropOpened}
                        width='8rem'
                        items={[
                           { label: 'Profile', link: `/profile/${user.username}`, icon: 'fa-solid fa-user' },
                           { label: 'Chats', link: '', icon: 'fa-solid fa-comment-dots' },
                           { label: 'Requests', link: '/partners-requests', icon: 'fa-solid fa-user-group' },
                           { label: 'Settings', link: '/edit-account?tab=settings', icon: 'fa-solid fa-gear' },
                           { label: 'Log Out', link: '', icon: 'fa-solid fa-arrow-right-from-bracket', action: handleLogout },
                        ]}
                        onClose={() => { setIsProfileMbDropOpened(false); setIsMenuOpened(false) }}
                     />
                  </>
               ) : (
                  <>
                     {/* Sign up / Log in buttons */}
                     <AuthButtons
                        onClickSignup={() => {
                           navigate('signup');
                           setIsMenuOpened(false);
                        }}
                        onClickLogin={() => {
                           navigate('login');
                           setIsMenuOpened(false);
                        }}
                     />
                  </>
               )}

            </div>
         </div>

      </nav >
   )
}
export default Navbar;