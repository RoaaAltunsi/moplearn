import styles from './CourseCategory.module.css';
import Filter from '../../components/filter/Filter';
import CourseCard from '../../components/courseCard/CourseCard';
import SelectInput from '../../components/inputFields/SelectInput';
import Pagination from '../../components/pagination/Pagination';
import EmptyState from '../../components/UIStates/EmptyState';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCoursesByCategory } from '../../redux/slices/courseSlice';
import { getTopics } from '../../redux/slices/topicSlice';
import { toast } from 'react-toastify';


function CourseCategory() {

   const location = useLocation();
   const dispatch = useDispatch();
   const { courseCategory } = useParams();
   const categoryId = courseCategory?.split("-")[0];
   const [partnerChecked, setPartnerChecked] = useState({}); // For partner list checkbox
   const [filters, setFilters] = useState({
      price: { free: false, discounted: false },
      topic: {},
      level: { beginner: false, intermediate: false, expert: false },
      platform: {},
      language: {}
   });
   const [sortFilter, setSortFilter] = useState('');
   const { coursesByCategory } = useSelector((state) => state.course);
   const { languages } = useSelector((state) => state.language);
   const { contributors } = useSelector((state) => state.contributor);
   const { topics } = useSelector((state) => state.topic);


   // ----------- Format extracted category from URL -----------
   const formCourseCategory = (category) => {
      return category
         .split('-')
         .slice(1) // remove category id
         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' ');
   }

   // ------------ Update filters' options on change -----------
   const handleFilterChange = (section, option) => {
      setFilters(prevState => ({
         ...prevState,
         [section]: {
            ...prevState[section],
            [option]: !prevState[section][option]
         }
      }))
   }

   // ------------------- Reset all filters --------------------
   const handleClearFilters = () => {
      setFilters(prevState => {
         const resetFilters = {};
         Object.keys(prevState).forEach(filter => {
            resetFilters[filter] = prevState[filter];
            Object.keys(resetFilters[filter]).forEach(option => {
               resetFilters[filter][option] = false;
            });
         });
         return resetFilters;
      })
   }

   // ----------- Add/Remove user from partner list ------------
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


   // ------------- Fetch course category topics ---------------
   useEffect(() => {
      try {
         dispatch(getTopics(categoryId)).unwrap();
      } catch (err) {
         toast.error(err?.error);
      }
   }, [dispatch, categoryId]);

   // ------- Initialize some filters state dynamically --------
   useEffect(() => {
      const initialTopicFilters = {};
      topics.forEach(topic => {
         initialTopicFilters[topic.title] = false;
      });
      const initialPlatformFilters = {};
      contributors.forEach(platform => {
         initialPlatformFilters[platform['contribution_form'].platform_name] = false;
      });
      const initialLanguageFilters = {};
      languages.forEach(language => {
         initialLanguageFilters[language.language] = false;
      });

      // Set the filters state
      setFilters(prevState => ({
         ...prevState,
         topic: initialTopicFilters,
         platform: initialPlatformFilters,
         language: initialLanguageFilters,
      }));
   }, [topics, contributors, languages]);

   // ---------- Fetch courses when category changes -----------
   useEffect(() => {
      try {
         dispatch(getCoursesByCategory(categoryId)).unwrap();
      } catch (err) {
         toast.error(err.error);
      }
   }, [dispatch, categoryId]);
   const itemsPerPage = 9;
   const [currentItems, setCurrentItems] = useState(coursesByCategory.slice(0, itemsPerPage));

   // ------------- Change content on page change --------------
   useEffect(() => {
      const getPageFromURL = () => {
         const searchParams = new URLSearchParams(location.search);
         const page = searchParams.get('page');
         return page ? parseInt(page, 10) : 1; // Return 1 as the default page
      };
      const handlePageClick = (startOffset) => {
         const newSlice = coursesByCategory.slice(startOffset, startOffset + itemsPerPage);
         setCurrentItems(newSlice);
      };

      const page = getPageFromURL();
      const startOffset = (page - 1) * itemsPerPage;
      handlePageClick(startOffset);
   }, [location.search, coursesByCategory])


   return (
      <div className='container'>

         {/* ---------------- Category Title ---------------- */}
         <div className={styles.category_title}>
            <h2> {formCourseCategory(courseCategory)} </h2>
         </div>

         {/* ----------------- Page Content ----------------- */}
         <div className={styles.content_wrap}>
            {/* LEFT SECTION: Filters */}
            <div className={styles.filter_section}>
               <Filter
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
               />
            </div>

            {/* RIGHT SECTION: Courses */}
            <div className={styles.courses_section}>
               {/* Results && Sort filter */}
               <div className={styles.courses_header}>
                  <span className='small_font'> {coursesByCategory.length} results </span>
                  <div>
                     <SelectInput
                        label="Sort by"
                        value={sortFilter}
                        options={['Highest Rated', 'Newest', 'Cheapest']}
                        onChange={(value) => setSortFilter(value)}
                     />
                  </div>
               </div>

               {/* Courses cards */}
               {coursesByCategory.length > 0 ? (
                  <>
                     <div className={styles.courses_grid}>
                        {currentItems.map(course => (
                           <CourseCard
                              key={course.id}
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
                        ))}
                     </div>

                     {/* Pagination section */}
                     {coursesByCategory.length > itemsPerPage && (
                        <Pagination
                           itemsLength={coursesByCategory.length}
                           itemsPerPage={itemsPerPage}
                        />
                     )}
                  </>

               ) : (
                  <div className={styles.empty_container}>
                     <EmptyState />
                  </div>
               )}
            </div>
         </div>

      </div>
   );
}

export default CourseCategory;