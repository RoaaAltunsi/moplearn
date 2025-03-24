import styles from './Contributors.module.css';
import { ReactComponent as ContributorsSVG } from '../../assets/images/contributors.svg';
import MainButton from '../../components/button/MainButton';
import CurvedLine from '../../components/curvedLine/CurvedLine';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


function Contributors() {

   const navigate = useNavigate();
   const { contributors } = useSelector((state) => state.contributor);


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
                        onClick={() => navigate('/contribute-form')}
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
               {contributors.length > 0 && contributors.map((contributor, index) => (
                  <img
                     key={index}
                     src={contributor.logo}
                     alt={`Platform ${index}`}
                     loading='lazy'
                     className={styles.platform}
                  />
               ))}
            </div>

         </div>
      </div>
   );
}

export default Contributors;