import styles from './AboutUs.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as AboutUsSVG } from '../../assets/images/about-us.svg';

const challenges = [
   {
      label: 'Money',
      icon: 'fa-solid fa-dollar-sign',
      description: 'We gather all free courses with exclusive offers, making education more affordable and accessible'
   },
   {
      label: 'Opportunities',
      icon: 'fa-solid fa-lightbulb',
      description: 'Stay updated on the latest and most valuable learning resources so you never miss an educational opportunity'
   },
   {
      label: 'Partner',
      icon: 'fa-solid fa-person',
      description: 'Find like-minded learning partners to keep you motivated, accountable, and engaged in your journey'
   }
];

function AboutUs() {
   return (
      <div className='container'>

         <div className={styles.content_wrap}>
            {/* --------------- Header Title --------------- */}
            <h2> About Us </h2>
            <p>
               Welcome to MOPlearn, your gateway to accessible, opportunity-rich, and collaborative learning!
               <br />At MOPlearn, we believe that everyone deserves the chance to learn and grow without barriers.
               We've crafted this platform to address three major challenges that often hinder self-learners:
            </p>

            {/* ----------- Addressed Challenges ----------- */}
            <div className={styles.challenges}>
               {challenges.map((challenge, index) => (
                  <div key={index} className={styles.challenge_box}>
                     <div className={styles.icon_container}>
                        <FontAwesomeIcon icon={challenge.icon} className={styles.icon} />
                     </div>

                     <div>
                        <h3> {challenge.label.toLocaleUpperCase()} </h3>
                        <p> {challenge.description} </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <AboutUsSVG className={styles.svg_shape} />

      </div>
   );
}

export default AboutUs;