import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import styles from './Navbar.module.css';
import Logo from '../../assets/images/Logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import slugify from "slugify";


const navSections = [
   { label: "Home", link: "/" },
   { label: "Courses", link: "/courses" },
   { label: "Find Partner", link: "/find-partner" },
   { label: 'Contributors', link: "/contributors" }
];

const coursesCategories = [
   "IT & Software",
   "Computer Science",
   "Business & Management",
   "Engineering",
   "Arts & Humanities",
   "Science",
   "Health & Medicine",
   "Web Development",
   "App Development",
];

// ---------- Reusable NavItem component ----------
const NavItem = ({ item, onClick = () => { } }) => (
   <li className={styles.nav_item}>
      <NavLink
         className={({ isActive }) =>
            `${styles.nav_link} ${isActive ? styles.active : ''}`
         }
         to={item.link}
         onClick={onClick}
      >
         {item.label}
      </NavLink>
   </li>
)

// --------------- Main navbar list ---------------
const MainNavList = ({ onClick = () => { } }) => (
   <ul className={styles.main_list}>
      {navSections.map((item, index) => (
         <NavItem key={index} item={item} onClick={onClick} />
      ))}
   </ul>
);

// ---------- List of Courses Categories ----------
const CoursesList = forwardRef(({ onClick = () => { } }, ref) => (
   <ul ref={ref || null} className={styles.courses_list}>
      {coursesCategories.map((item, index) => (
         <NavItem
            key={index}
            item={{
               label: item,
               link: `/course/${slugify(item, { lower: true })}` // Dynamically generate the link
            }}
            onClick={onClick}
         />
      ))}
   </ul>
));

// ------- Signup/Login container component -------
const AuthButtons = ({
   onClickSignup = () => { },
   onClickLogin = () => { }
}) => (
   <div className={styles.auth_buttons}>
      <button className={styles.nav_button} onClick={onClickSignup}>
         Sign Up
      </button>

      <button className={styles.nav_button} onClick={onClickLogin}>
         Log In
      </button>
   </div>
)

function Navbar() {

   const navigate = useNavigate();
   const location = useLocation(); // Get the current route
   const iconRef = useRef(null);
   const mobileMenuRef = useRef(null);
   const coursesListRef = useRef(null);
   const coursesDropMenu = useRef(null);
   const [isMenuOpened, setIsMenuOpened] = useState(false); // Navbar in tablet/mobile mode
   const [hiddenCourses, setHiddenCourses] = useState([]);
   const [isDropMenuOpened, setIsDropMenuOpened] = useState(false); // Courses drop menu


   // ---------- Close menu when clicking outside the component ----------
   const handleClickOutside = useCallback((e) => {
      if (iconRef.current && iconRef.current.contains(e.target)) return; // Ignore clicks on the icon itself
      if (isMenuOpened && mobileMenuRef?.current && !mobileMenuRef.current.contains(e.target)) {
         setIsMenuOpened(false);
      }
      if (isDropMenuOpened && coursesDropMenu?.current && !coursesDropMenu.current.contains(e.target)) {
         setIsDropMenuOpened(false);
      }
   }, [isDropMenuOpened, isMenuOpened]);

   // ---------- Update hidden courses based on container width ----------
   const updateHiddenCourses = () => {
      if (!coursesListRef?.current) return;

      const coursesUlWidth = coursesListRef.current.getBoundingClientRect().width;
      const coursesLiElements = coursesListRef.current.children;
      let totalWidth = 0;
      const newHiddenCourses = [];

      Array.from(coursesLiElements).forEach((item, index) => {
         totalWidth += item.getBoundingClientRect().width;
         if (parseInt(totalWidth) > coursesUlWidth) {
            newHiddenCourses.push(coursesCategories[index]);
         }
      });
      setHiddenCourses(newHiddenCourses);
   };


   // -------------- Apply update logic only in custom routes -------------
   useEffect(() => {
      if (location.pathname.startsWith('/course')) {
         // Wait for the browser to update the layout and then update the visible courses
         requestAnimationFrame(() => {
            updateHiddenCourses();
         })
         window.addEventListener('resize', updateHiddenCourses);
      }
      return () => {
         window.removeEventListener('resize', updateHiddenCourses);
      };
   }, [location.pathname]);

   // -------------- Handle clicking outside the opened menu --------------
   useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [handleClickOutside]);

   // ----- Ensure each menu only appears in its designed window size -----
   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth > 768) {
            setIsMenuOpened(false);
         } else {
            setIsDropMenuOpened(false);
         }
      }
      window.addEventListener('resize', handleResize);

      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, []);


   return (
      <nav className={styles.navbar}>

         {/* ---------------------- Main Nav Section ---------------------- */}
         <div className={styles.main_section}>
            {/* Logo */}
            <Link to="/">
               <img src={Logo} alt="Loog" className={styles.logo} />
            </Link>

            {/* Main nav list container */}
            <div className={styles.nav_links_container}>
               <MainNavList />

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
            </div>

            {/* Hamburger icon for tablet/mobile mode */}
            <FontAwesomeIcon
               icon="fa-solid fa-bars"
               onClick={() => setIsMenuOpened(true)}
               className={styles.icon}
            />
         </div>

         {/* --------------------- Courses Nav Section -------------------- */}
         <div className={`
                  ${styles.courses_section}
                  ${location.pathname.startsWith('/course') ? styles.visible : ''}
               `}
         >
            <div className={styles.nav_links_container}>
               <CoursesList ref={coursesListRef} />

               <FontAwesomeIcon
                  ref={iconRef}
                  icon="fa-solid fa-ellipsis-vertical"
                  onClick={() => setIsDropMenuOpened(!isDropMenuOpened)}
                  className={`
                     ${styles.icon}
                     ${hiddenCourses.length > 0 ? styles.visible : ''}
                  `}
               />
            </div>
         </div>

         {/* -- Drop down menu if courses exceed the available nav width -- */}
         <ul
            ref={coursesDropMenu}
            className={`
               ${styles.courses_dropdown}
               ${(hiddenCourses.length > 0 && isDropMenuOpened) ? styles.visible : ''}
               `}>
            {hiddenCourses.map((item, index) => (
               <NavItem
                  key={index}
                  item={{
                     label: item,
                     link: `/course/${slugify(item, { lower: true })}` // Dynamically generate the link
                  }}
                  onClick={() => setIsDropMenuOpened(false)}
               />
            ))}
         </ul>

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
               <FontAwesomeIcon
                  icon="fa-solid fa-xmark"
                  className={styles.icon}
                  onClick={() => setIsMenuOpened(false)}
               />

               <MainNavList onClick={() => setIsMenuOpened(false)} />

               {location.pathname === '/courses' && (
                  <CoursesList onClick={() => setIsMenuOpened(false)} />
               )}

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
            </div>
         </div>

      </nav>
   )
}
export default Navbar;