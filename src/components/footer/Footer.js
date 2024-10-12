import styles from './Footer.module.css';
import { Link } from 'react-router-dom';
import FullLogo from '../../assets/images/fullLogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const contactData = [
   { icon: 'envelope', value: 'support@moplearn.org' },
   { icon: 'phone', value: 'xxx xxx xxx' }
];
const aboutData = [
   { link: '/', label: 'Who we are?' },
   { link: '/contribute-form', label: 'Contribute with us' }
];
const followData = [
   { icon: 'fa-brands fa-instagram', link: '/' },
   { icon: 'fa-brands fa-x-twitter', link: '/' }
];

function Footer() {
   return (
      <footer className={styles.container}>
         {/* Logo */}
         <div className={styles.logo}>
            <img src={FullLogo} alt="Loog" />
         </div>

         <div className={styles.sections}>
            {/* Contact Section */}
            <div>
               <h3> Contact Us </h3>
               <ul>
                  {contactData.map((item, index) => (
                     <li key={index}>
                        <FontAwesomeIcon className={styles.icon} icon={item.icon} />
                        <span> {item.value} </span>
                     </li>
                  ))}
               </ul>
            </div>

            {/* About Section */}
            <div>
               <h3> About Us </h3>
               <ul>
                  {aboutData.map((item, index) => (
                     <li key={index}>
                        <Link to={item.link} className={styles.link}> {item.label} </Link>
                     </li>
                  ))}
               </ul>
            </div>

            {/* Follow Section */}
            <div>
               <h3> Follow Us </h3>
               <div className={styles.social_media}>
                  {followData.map((item, index) => (
                     <Link key={index} to={item.link}>
                        <FontAwesomeIcon className={styles.icon} icon={item.icon} />
                     </Link>
                  ))}
               </div>
            </div>
         </div>
      </footer>
   );
}

export default Footer;