import styles from './PartnerCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DefaultImg from '../../assets/images/default-profile.png';
import MainButton from '../button/MainButton';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PartnerCard({
   id,
   image,
   fullName,
   username,
   specialization,
   interests,
   friendshipReq, // { friendship_id , user_id }
   handleFriendship
}) {

   const tagsContainerRef = useRef();
   const [isTagsOverflowed, setIsTagsOverFlowed] = useState(false);
   const friendshipStatus = friendshipReq?.status;


   // ------------------ Format Username for URL ------------------
   const formatNameForURL = () => {
      return username
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
               pathname: `/profile/${formatNameForURL()}`,
               state: { id }
            }}
            className={styles.link}
         >
            {/* ---------- Descriptive User Information ---------- */}
            <div className={styles.dscrp_section}>
               <div className={styles.image_container}>
                  <img src={image ? image : DefaultImg} alt="partner" loading='lazy' />
               </div>

               <h3> {fullName ?? username} </h3>

               {specialization && (
                  <span className='small_font'> {specialization} </span>
               )}
            </div>

            {/* ----------------- Interests Tags ----------------- */}
            {interests?.length > 0 && (
               <div className={styles.interests}>
                  <div className={styles.header}>
                     <FontAwesomeIcon icon="fa-regular fa-heart" />
                     <h4 className='small_font'> INTERESTS </h4>
                  </div>
                  <div
                     ref={tagsContainerRef}
                     className={`${styles.tags_container} ${isTagsOverflowed ? styles.overflowed : ''}`}
                  >
                     {interests.map((interest) => (
                        <div key={interest.id} className={styles.tag}>
                           <span className='small_font'> {interest.title} </span>
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
               isDestructive={friendshipStatus === 'accepted'}
               label={
                  friendshipStatus === 'accepted'
                     ? 'Remove Partnership'
                     : friendshipStatus === 'sent' || friendshipStatus === 'received'
                        ? 'Pending Request'
                        : 'Request Partnership'
               }
               backgroundColor={
                  friendshipStatus === 'sent' || friendshipStatus === 'received'
                     ? 'var(--light-grey-color)'
                     : null
               }
               customStyles={
                  friendshipStatus === 'sent' || friendshipStatus === 'received'
                     ? { pointerEvents: 'none' }
                     : {}
               }
               onClick={() => handleFriendship(friendshipReq)}
            />
         </div>

      </div>
   );
}

export default PartnerCard;