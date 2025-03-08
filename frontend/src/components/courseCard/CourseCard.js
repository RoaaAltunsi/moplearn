import styles from './CourseCard.module.css';
import MainButton from '../button/MainButton';
import CheckboxInput from '../inputFields/CheckboxInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

function CourseCard({
   id,
   link,
   image,
   price,
   oldPrice,
   title,
   platformName,
   rating,
   totalReviews,
   isChecked, // For partner list checkbox
   handleCheckboxChange
}) {

   const navigate = useNavigate();

   // ---------------- Format Course Title for URL -----------------
   const formatTitleForURL = () => {
      return title
         .toLowerCase()
         .replace(/and|,|\.|etc/g, '')           // Remove specific words and symbols
         .replace(/\s+/g, '-')                   // Replace spaces with hyphens
         .replace(/:.*/, '')                     // Remove text after a colon
         .replace(/[^a-z0-9-]/g, '')             // Remove any other non-alphanumeric characters
         .replace(/^-+|-+$/g, '');               // Trim extra hyphens at start/end
   };

   // ------- Find Partners to Specific Course by Passing ID -------
   const handleFindPartnerClick = () => {
      const formatedTitle = formatTitleForURL(title);
      navigate(`/find-partner/${formatedTitle}`, { state: { id } });
   };


   return (
      <div className={styles.container}>

         {/* ------------- Find Partner Button ------------- */}
         <div className={styles.find_partner}>
            <MainButton
               isCircular={true}
               tooltip="Find Partner"
               iconName={"fa-solid fa-user-plus"}
               onClick={handleFindPartnerClick}
            />
         </div>

         {/* ---------------- Card Container --------------- */}
         <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
         >
            {/* Course Image */}
            <div className={styles.img}>
               <img src={image} alt="course" />
            </div>

            {/* Course Descriptive data */}
            <div className={styles.card_content}>
               <div className={styles.price_section}>
                  <h3 className={styles.price}>
                     {price > 0 ? `$ ${price}` : 'Free'}
                  </h3>
                  {oldPrice && (
                     <span className={styles.old_price}>
                        $ {oldPrice}
                     </span>
                  )}
               </div>

               <p className={`${styles.title} small_font`}> {title} </p>

               <div className={styles.course_meta_section}>
                  <span className='small_font'> {platformName} </span>
                  {(rating || totalReviews) && (
                     <div className={styles.rating_subsection}>
                        <h3> {rating} </h3>
                        <FontAwesomeIcon
                           icon="fa-solid fa-star"
                           style={{ color: 'var(--yellow-color)' }}
                        />
                        <span className='small_font'> ({totalReviews}) </span>
                     </div>
                  )}
               </div>

               <div className={styles.partner_section}>
                  <CheckboxInput
                     label="Add Me to Partner List"
                     isChecked={isChecked}
                     onChange={handleCheckboxChange}
                  />
               </div>
            </div>
         </a>
      </div>
   );
}

export default CourseCard;