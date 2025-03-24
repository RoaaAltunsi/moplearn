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
import { getNewestCourses, getCheapestCourses, addToPartnerList, removeFromPartnerList } from '../../redux/slices/courseSlice';
import { toast } from 'react-toastify';
import { getUserCourses } from '../../redux/slices/userSlice';


function Courses() {

   const dispatch = useDispatch();
   const [partnerChecked, setPartnerChecked] = useState({}); // For partner list checkbox
   const { newCourses, cheapestCourses } = useSelector((state) => state.course);
   const { userCourseIds } = useSelector((state) => state.user);
   const { user, isAuthenticated } = useSelector((state) => state.auth);
   const [toastMsg, setToastMsg] = useState(''); // fix issue of trigger toast twice in add/remove partner


   // ----------- Add/Remove user from partner list -----------
   const handlePartnerCheckboxChange = async (courseId, isChecked) => {
      try {
         setPartnerChecked(prevState => ({
            ...prevState,
            [courseId]: isChecked
         }));

         isChecked
            ? await dispatch(addToPartnerList({ user_id: user?.id, course_id: courseId })).unwrap()
            : await dispatch(removeFromPartnerList({ user_id: user?.id, course_id: courseId })).unwrap();

         setToastMsg(isChecked ? "Added to partner list successfully" : "Removed from partner list successfully");

      } catch (err) {
         toast.error(err.error);
      }
   };


   // -------------- Fetch courses from DB --------------
   useEffect(() => {
      try {
         if (newCourses?.length === 0) {
            dispatch(getNewestCourses()).unwrap();
         }
         if (cheapestCourses?.length === 0) {
            dispatch(getCheapestCourses()).unwrap();
         }
      } catch (err) {
         toast.error(err.error);
      }
   }, [dispatch, newCourses, cheapestCourses]);

   // ---------- Fetch user registered courses -----------
   useEffect(() => {
      if (isAuthenticated) {
         let checkedMap = {};
         if (userCourseIds?.length === 0) {
            dispatch(getUserCourses(user?.id)).then((response) => {
               response.payload.forEach(id => {
                  checkedMap[id] = true;
               });
            });

         } else {
            userCourseIds.forEach(id => {
               checkedMap[id] = true;
            });
         }
         setPartnerChecked(checkedMap); // Set pre-checked state
      }
   }, [dispatch, userCourseIds, user?.id, isAuthenticated]);

   // -------- Handle display toast message only once ---------
   useEffect(() => {
      if (toastMsg) {
         toast.success(toastMsg);
      }
   }, [userCourseIds?.length]);


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
                              platformName={course.platform.platform_name}
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