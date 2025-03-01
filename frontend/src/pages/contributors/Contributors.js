import styles from './Contributors.module.css';
import { ReactComponent as ContributorsSVG } from '../../assets/images/contributors.svg';
import MainButton from '../../components/button/MainButton';
import CurvedLine from '../../components/curvedLine/CurvedLine';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getContributors } from '../../redux/slices/contributorSlice';
import { toast } from 'react-toastify';


function Contributors() {

   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { contributors } = useSelector((state) => state.contributor);


   // -------------- Fetch contributors from DB --------------
   useEffect(() => {
      if (contributors.length === 0) {
         try {
            dispatch(getContributors());
            
         } catch(err) {
            toast.error(err.error);
         }
      }
   }, [dispatch, contributors]);


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
                     src={contributor['contribution_form'].logo}
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