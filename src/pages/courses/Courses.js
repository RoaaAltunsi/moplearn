import styles from './Courses.module.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import CurvedLine from '../../components/curvedLine/CurvedLine';
import CourseCard from '../../components/courseCard/CourseCard';
import CourseImage from '../../assets/images/course-img-test.png';
import { useState } from 'react';

const courses = [
   {
      id: 1,
      link: "https://www.udemy.com/course/php-mvc-from-scratch/",
      image: CourseImage,
      price: 14.99,
      oldPrice: 54.99,
      title: 'Write PHP Like a Pro: Build a PHP MVC Framework From Scratch',
      platformName: 'Udemy',
      rating: 4.8,
      ratingNum: 3093
   },
   {
      id: 2,
      link: "https://www.udemy.com/course/php-mvc-from-scratch/",
      image: CourseImage,
      price: 0,
      oldPrice: 54.99,
      title: 'Write PHP Like a Pro: Build a PHP MVC Framework From Scratch From Scratch From Scratch',
      platformName: 'Udemy',
      rating: 4.8,
      ratingNum: 3093
   },
   {
      id: 3,
      link: "https://www.udemy.com/course/php-mvc-from-scratch/",
      image: CourseImage,
      price: 14.99,
      oldPrice: 54.99,
      title: 'Write PHP Like a Pro: Build a PHP MVC Framework From Scratch',
      platformName: 'Udemy',
      rating: 4.8,
      ratingNum: 3093
   },
   {
      id: 4,
      link: "https://www.udemy.com/course/php-mvc-from-scratch/",
      image: CourseImage,
      price: 14.99,
      oldPrice: 54.99,
      title: 'Write PHP Like a Pro: Build a PHP MVC Framework From Scratch',
      platformName: 'Udemy',
      rating: 4.8,
      ratingNum: 3093
   },
]


function Courses() {

   const [partnerChecked, setPartnerChecked] = useState({}); // For partner list checkbox

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
                              oldPrice={course.oldPrice}
                              title={course.title}
                              platformName={course.platformName}
                              rating={course.rating}
                              ratingNum={course.ratingNum}
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
         <Section title="Newly Courses" courses={courses} />
         <CurvedLine />
         <Section title="Exclusive Discount" courses={courses} />
      </div>
   );
}

export default Courses;