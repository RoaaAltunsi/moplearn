import styles from './Contributors.module.css';
import { ReactComponent as ContributorsSVG } from '../../assets/images/contributors.svg';
import MainButton from '../../components/button/MainButton';
import CurvedLine from '../../components/curvedLine/CurvedLine';

// Get all platforms' logos
const images = require.context('../../assets/images/platforms', false, /\.(png|jpe?g|svg)$/);

function Contributors() {

   const imagePaths = images.keys().map(image => images(image));

   return (
      <div className='container'>
         <div className={styles.content_wrap}>

            {/* -------------- Header section --------------- */}
            <div className={styles.header}>
               {/* Description */}
               <div className={styles.description}>
                  <h2> Partners of Success </h2>
                  <p> Join and help us spread your scientific content to as many people as possible! </p>
                  <div className={styles.btn_container}>
                     <MainButton
                        label="Contribute with us"
                        onClick={() => console.log("Button Clicked!")}
                     />
                  </div>
               </div>

               {/* Image */}
               <ContributorsSVG className={styles.img} />
            </div>

            {/* ---------------- Curved Line ---------------- */}
            <div className={styles.line_container}>
               <CurvedLine />
            </div>

            {/* ----------- Contributors Platforms ---------- */}
            <div className={styles.platforms_grid}>
               {imagePaths.map((src, index) => (
                  <img
                     key={index}
                     src={src}
                     alt={`Platform ${index}`}
                     className={styles.platform}
                  />
               ))}
            </div>

         </div>
      </div>
   );
}

export default Contributors;