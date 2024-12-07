import styles from './PartnerCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DefaultImg from '../../assets/images/default-profile.png';
import MainButton from '../button/MainButton';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PartnerCard({
   id,
   image,
   name,
   specialization,
   interests,
   isFriend,
}) {

   const tagsContainerRef = useRef();
   const [isTagsOverflowed, setIsTagsOverFlowed] = useState(false);


   // ---------- Handle Sending/Removing Partner Request ----------
   const handleClickButton = () => {
      if (isFriend) {
         console.log("DELETE from friend list");
      } else {
         console.log("POST friend request");
      }
   };

   // ------------------ Format Username for URL ------------------
   const formatNameForURL = () => {
      return name
         .toLowerCase()
         .replaceAll(' ', '-');
   };


   // ------------- Control Displaying Interests Tags -------------
   useEffect(() => {
      if (tagsContainerRef.current) {
         const container = tagsContainerRef.current;
         setIsTagsOverFlowed(container.scrollHeight > container.clientHeight);
      }
   }, [interests]);


   return (
      <div className={styles.container}>

         <Link
            to={{
               pathname: `/profile/${formatNameForURL(name)}`,
               state: { id }
            }}
            className={styles.link}
         >
            {/* ---------- Descriptive User Information ---------- */}
            <div className={styles.dscrp_section}>
               <div className={styles.image_container}>
                  <img src={image ? image : DefaultImg} alt="partner" />
               </div>

               <h3> {name} </h3>

               {specialization && (
                  <span className='small_font'> {specialization} </span>
               )}
            </div>

            {/* ----------------- Interests Tags ----------------- */}
            {interests && (
               <div className={styles.interests}>
                  <div className={styles.header}>
                     <FontAwesomeIcon icon="fa-regular fa-heart" />
                     <h4 className='small_font'> INTERESTS </h4>
                  </div>
                  <div
                     ref={tagsContainerRef}
                     className={`${styles.tags_container} ${isTagsOverflowed ? styles.overflowed : ''}`}
                  >
                     {interests.map((interest, index) => (
                        <div key={index} className={styles.tag}>
                           <span className='small_font'> {interest} </span>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </Link>

         {/* ------------------ Button container ----------------- */}
         <div className={styles.btn_container}>
            <MainButton
               width="100%"
               isDestructive={isFriend}
               label={`${isFriend ? 'Remove' : 'Request'} Partnership`}
               onClick={handleClickButton}
            />
         </div>

      </div>
   );
}

export default PartnerCard;