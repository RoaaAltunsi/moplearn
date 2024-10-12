import { NavLink, Link } from "react-router-dom";
import styles from './Navbar.module.css';
import Logo from '../../assets/images/Logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const navSections = [
   { label: "Home", link: "/" },
   { label: "Courses", link: "/courses" },
   { label: "Find Partner", link: "/findPartner" },
   { label: 'Contributors', link: "/contributors" }
];

function Navbar() {

   const naviagte = useNavigate();
   const [isMenuOpened, setIsMenuOpened] = useState(false);
   const [enableTransition, setEnableTransition] = useState(false);

   // --------------- Handle Opening and closing hamburger menu ---------------
   const toggleMobileMenu = () => {
      setEnableTransition(true); // Enable transition only when toggling the menu
      setIsMenuOpened(!isMenuOpened);
   }

   // ----------- Ensure the menu only appears in Tablet/Mobile mode -----------
   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth > 768) {
            setIsMenuOpened(false);
            setEnableTransition(false); // Disable transition on resize
         }
      }
      window.addEventListener('resize', handleResize);

      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, [])

   return (
      <nav className={styles.navbar}>
         <div className={styles.navbar_container}>

            {/* Logo */}
            <Link to="/">
               <img src={Logo} alt="Loog" className={styles.logo} />
            </Link>

            {/* Nav sections */}
            <div className={`
               ${styles.nav_links_container} 
               ${isMenuOpened ? styles.menu_opened : ''}
               ${enableTransition ? styles.with_transition : ''}
            `}>
               <ul className={styles.nav_menu}>
                  {navSections.map((item, index) => (
                     <li key={index} className={styles.nav_item}>
                        <NavLink
                           className={({ isActive }) =>
                              `${styles.nav_link} ${isActive ? styles.active : ''}`
                           }
                           to={item.link}
                           onClick={() => setIsMenuOpened(false)}
                        >
                           {item.label}
                        </NavLink>
                     </li>
                  ))}
               </ul>

               {/* Sign up and Log in buttons */}
               <div className={styles.auth_buttons}>
                  <button className={styles.nav_button} onClick={() => {
                     naviagte('signup');
                     setIsMenuOpened(false)
                  }}>
                     Sign Up
                  </button>

                  <button className={styles.nav_button} onClick={() => {
                     naviagte('login');
                     setIsMenuOpened(false)
                  }}>
                     Log In
                  </button>
               </div>
            </div>

            <FontAwesomeIcon
               icon={isMenuOpened ? 'times' : 'bars'}
               onClick={toggleMobileMenu}
               className={styles.icon}
            />

         </div>

         {/* Hamburger's menu Transparent Background */}
         <div className={`
            ${styles.transparent_background} 
            ${isMenuOpened ? styles.menu_opened : ''}
         `} />
      </nav>
   )
}
export default Navbar;