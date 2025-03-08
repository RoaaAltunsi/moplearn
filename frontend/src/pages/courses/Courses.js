import styles from './Courses.module.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import CurvedLine from '../../components/curvedLine/CurvedLine';
import CourseCard from '../../components/courseCard/CourseCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNewestCourses, getCheapestCourses } from '../../redux/slices/courseSlice';


function Courses() {

   const dispatch = useDispatch();
   const [partnerChecked, setPartnerChecked] = useState({}); // For partner list checkbox
   const { newCourses, cheapestCourses } = useSelector((state) => state.course);


   // -------------- Fetch courses from DB --------------
   useEffect(() => {
      if (newCourses?.length === 0) {
         dispatch(getNewestCourses());
      }
      if (cheapestCourses?.length === 0) {
         dispatch(getCheapestCourses());
      }
   }, [dispatch, newCourses, cheapestCourses]);


   // ----------- Add/Remove user from partner list -----------
   const handlePartnerCheckboxChange = (courseId, isChecked) => {
      setPartnerChecked(prevState => ({
         ...prevState,
         [courseId]: isChecked
      }));

      if (isChecked) {
         console.log("POST user to partner list");
      } else {
         console.log("DELETE user from partner list");
      }
   };


   // ----------------- Render Courses section ----------------
   const Section = ({ title, courses }) => {
      // Create a unique class name for pagination based on the section title
      const paginationClass = `pagination-${title.replace(/\s+/g, '-').toLowerCase()}`;

      return (
         <div className={styles.section}>
            <h2> {title} </h2>

            <div className={styles.slide_container}>
               {/* Courses Cards */}
               <div className={styles.swiper_container}>
                  <Swiper
                     slidesPerView={1}
                     breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                     }}
                     modules={[Navigation, Pagination, Autoplay]}
                     navigation={{
                        nextEl: `.${paginationClass}-next`,
                        prevEl: `.${paginationClass}-prev`,
                     }}
                     pagination={{
                        el: `.${paginationClass}`,
                        dynamicBullets: true,
                        clickable: true
                     }}
                     autoplay={{
                        delay: 3000,
                        disableOnInteraction: true, // Stop autoplay after user interaction
                     }}
                  >
                     {courses.map(course => (
                        <SwiperSlide key={course.id} className={styles.card_container}>
                           <CourseCard
                              id={course.id}
                              link={course.link}
                              image={course.image}
                              price={course.price}
                              oldPrice={course.old_price}
                              title={course.title}
                              platformName={course.platform}
                              rating={course.rating}
                              totalReviews={course.total_reviews}
                              isChecked={!!partnerChecked[course.id]}
                              handleCheckboxChange={isChecked => handlePartnerCheckboxChange(course.id, isChecked)}
                           />
                        </SwiperSlide>
                     ))}
                  </Swiper>
               </div>

               {/* Pagination and Navigation with unique class names */}
               <div
                  className={`swiper-button-next ${paginationClass}-next ${styles.swiper_navBtn}`}
               />
               <div
                  className={`swiper-button-prev ${paginationClass}-prev ${styles.swiper_navBtn}`}
               />
               <div
                  className={`${paginationClass} swiper-pagination`}
                  style={{ '--swiper-pagination-color': 'var(--secondary-color)' }}
               />
            </div>
         </div>
      );
   };

   return (
      <div className='container'>
         <Section title="Newly Courses" courses={newCourses} />
         <CurvedLine />
         <Section title="Exclusive Discount" courses={cheapestCourses} />
      </div>
   );
}

export default Courses;