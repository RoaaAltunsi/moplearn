import styles from './CourseCard.module.css';
import MainButton from '../button/MainButton';
import CheckboxInput from '../inputFields/CheckboxInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function CourseCard({
   link,
   image,
   price,
   oldPrice,
   title,
   platformName,
   rating,
   ratingNum,
   isChecked, // For partner list checkbox
   handleCheckboxChange
}) {

   return (
      <div className={styles.container}>

         {/* ------------- Find Partner Button ------------- */}
         <div className={styles.find_partner}>
            <MainButton
               isCircular={true}
               tooltip="Find Partner"
               iconName={"fa-solid fa-user-plus"}
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
                     {price===0? 'Free' : `$ ${price}`}
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
                  {(rating || ratingNum) && (
                     <div className={styles.rating_subsection}>
                        <h3> {rating} </h3>
                        <FontAwesomeIcon
                           icon="fa-solid fa-star"
                           style={{ color: 'var(--yellow-color)' }}
                        />
                        <span className='small_font'> ({ratingNum}) </span>
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