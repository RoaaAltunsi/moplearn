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
   const [filteredCourses, setFilteredCourses] = useState([]);


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
   const [currentItems, setCurrentItems] = useState(filteredCourses.slice(0, itemsPerPage));

   // ------------- Change content on page change --------------
   useEffect(() => {
      const getPageFromURL = () => {
         const searchParams = new URLSearchParams(location.search);
         const page = searchParams.get('page');
         return page ? parseInt(page, 10) : 1; // Return 1 as the default page
      };
      const handlePageClick = (startOffset) => {
         const newSlice = filteredCourses.slice(startOffset, startOffset + itemsPerPage);
         setCurrentItems(newSlice);
      };

      const page = getPageFromURL();
      const startOffset = (page - 1) * itemsPerPage;
      handlePageClick(startOffset);
   }, [location.search, filteredCourses]);

   // --------------------- Filter courses ---------------------
   useEffect(() => {
      const filtering = coursesByCategory
      .filter(course => {
         // Filter by Price
         if (filters.price.free && !filters.price.discounted && course.price > 0) return false;
         if (filters.price.discounted && !filters.price.free && course.old_price <= course.price) return false;

         // Filter by Topic
         const selectedTopics = Object.keys(filters.topic).filter(topic => filters.topic[topic]);
         if (selectedTopics.length > 0 && !selectedTopics.includes(course.topic.title)) return false;

         // Filter by Level
         const selectedLevels = Object.keys(filters.level).filter(level => filters.level[level]);
         if (selectedLevels.length > 0 && !selectedLevels.includes(course.level)) return false;

         // Filter by Language
         const selectedLangs = Object.keys(filters.language).filter(lang => filters.language[lang]);
         if (selectedLangs.length > 0 && !selectedLangs.includes(course.language.language)) return false;

         // Filter by Platform
         const selectedPlat = Object.keys(filters.platform).filter(plat => filters.platform[plat]);
         if (selectedPlat.length > 0 && !selectedPlat.includes(course.platform.platform_name)) return false;

         return true;
      })
      .sort((a,b) => {
         if (sortFilter === 'highest-rated') {
            return b.rating - a.rating;
         } else if (sortFilter === 'newest') {
            return new Date(b.created_at) - new Date(a.created_at);
         } else if (sortFilter === 'cheapest') {
            return a.price - b.price;
         }
         return 0; // Default: No sorting
      });
      
      setFilteredCourses(filtering);
   }, [coursesByCategory, filters, sortFilter]);


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
                  <span className='small_font'> {filteredCourses.length} results </span>
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
               {filteredCourses.length > 0 ? (
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
                     {filteredCourses.length > itemsPerPage && (
                        <Pagination
                           itemsLength={filteredCourses.length}
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