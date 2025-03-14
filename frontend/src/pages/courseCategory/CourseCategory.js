import styles from './CourseCategory.module.css';
import Filter from '../../components/filter/Filter';
import CourseCard from '../../components/courseCard/CourseCard';
import SelectInput from '../../components/inputFields/SelectInput';
import Pagination from '../../components/pagination/Pagination';
import EmptyState from '../../components/UIStates/EmptyState';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCoursesByCategory } from '../../redux/slices/courseSlice';
import { getTopicsByCategory } from '../../redux/slices/topicSlice';


function CourseCategory() {

   const dispatch = useDispatch();
   const navigate = useNavigate();
   const location = useLocation();
   const { courseCategory } = useParams();
   const categoryId = courseCategory?.split("-")[0];
   const [partnerChecked, setPartnerChecked] = useState({}); // For partner list checkbox
   const [filters, setFilters] = useState({
      price: { free: false, discounted: false },
      topics: {},
      levels: { beginner: false, intermediate: false, expert: false },
      platforms: {},
      languages: {},
   });
   const [sortFilter, setSortFilter] = useState('');
   const { coursesByCategory, pagination } = useSelector((state) => state.course);
   const { languages } = useSelector((state) => state.language);
   const { contributors } = useSelector((state) => state.contributor);
   const { topics } = useSelector((state) => state.topic);
   const searchParams = new URLSearchParams(location.search);
   const currentPage = parseInt(searchParams.get("page"), 10) || 1;


   // ----------- Format extracted category from URL -----------
   const formCourseCategory = (category) => {
      return category
         .split('-')
         .slice(1) // remove category id
         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' ');
   }

   // ------------ Update filters' options on change -----------
   const handleFilterChange = (filterType, option) => {
      setFilters(prevState => ({
         ...prevState,
         [filterType]: {
            ...prevState[filterType],
            [option]: !prevState[filterType][option]
         }
      }));

      // Reset page to 1
      searchParams.set("page", 1);
      navigate(`${location.pathname}?${searchParams.toString()}`);
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

   // --------------- Update URL on page change ----------------
   const handlePageChange = (newPage) => {
      searchParams.set("page", newPage);
      navigate(`${location.pathname}?${searchParams.toString()}`);
   };

   // -------------- Map selected filters to IDs ---------------
   const getFilterIds = useCallback((filterType) => {
      switch (filterType) {
         case 'topics':
            return topics
               .filter(topic => filters[filterType][topic.title])
               .map(topic => topic.id);
         case 'platforms':
            return contributors
               .filter(platform => filters[filterType][platform.platform_name])
               .map(platform => platform.id);
         case 'languages':
            return languages
               .filter(language => filters[filterType][language.language])
               .map(language => language.id);
         default:
            return [];
      }
   }, [topics, contributors, languages, filters]);

   // ---------- Format filters for backend end point -----------
   const transformFiltersToQueryParams = useCallback(() => {
      const params = {};

      // Price Filter
      const selectedPrices = [];
      if (filters.price.free) selectedPrices.push('free');
      if (filters.price.discounted) selectedPrices.push('discounted');
      if (selectedPrices.length > 0) params.price = selectedPrices.join(',');

      // Topic Filter
      const selectedTopics = getFilterIds('topics');
      if (selectedTopics.length > 0) params.topics = selectedTopics.join(',');

      // Level Filter
      const selectedLevels = Object.keys(filters['levels']).filter(option => filters['levels'][option]);
      if (selectedLevels.length > 0) params.levels = selectedLevels.join(',');

      // Platfrom Filter
      const selectedPlatforms = getFilterIds('platforms');
      if (selectedPlatforms.length > 0) params.platforms = selectedPlatforms.join(',');

      // Language Filter
      const selectedLanguages = getFilterIds('languages');
      if (selectedLanguages.length > 0) params.languages = selectedLanguages.join(',');

      // Sort Filter
      if (sortFilter) params.sort = sortFilter;

      // Page Parameter
      if (currentPage) params.page = currentPage;

      return params;
   }, [filters, sortFilter, currentPage, getFilterIds]);


   // ------- Initialize some filters state dynamically --------
   useEffect(() => {
      const initialTopicFilters = {};
      topics.forEach(topic => {
         initialTopicFilters[topic.title] = false;
      });

      const initialPlatformFilters = {};
      contributors.forEach(platform => {
         initialPlatformFilters[platform.platform_name] = false;
      });

      const initialLanguageFilters = {};
      languages.forEach(language => {
         initialLanguageFilters[language.language] = false;
      });

      // Set the filters state
      setFilters(prevState => ({
         ...prevState,
         topics: initialTopicFilters,
         platforms: initialPlatformFilters,
         languages: initialLanguageFilters,
      }));
   }, [topics, contributors, languages]);

   // ---------- Fetch topics and courses for category ----------
   useEffect(() => {
      dispatch(getTopicsByCategory(categoryId));
   }, [dispatch, categoryId]);

   useEffect(() => {
      const params = transformFiltersToQueryParams();
      dispatch(getCoursesByCategory({
         categoryId,
         params
      }));
   }, [dispatch, categoryId, transformFiltersToQueryParams]);


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
                  <span className='small_font'> {pagination.total} results </span>
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
                        {coursesByCategory.map(course => (
                           <CourseCard
                              key={course.id}
                              id={course.id}
                              link={course.link}
                              image={course.image}
                              price={course.price}
                              oldPrice={course.old_price}
                              title={course.title}
                              platformName={course.platform?.platform_name}
                              rating={course.rating}
                              totalReviews={course.total_reviews}
                              isChecked={!!partnerChecked[course.id]}
                              handleCheckboxChange={isChecked => handlePartnerCheckboxChange(course.id, isChecked)}
                           />
                        ))}
                     </div>

                     {/* Pagination section */}
                     {pagination.total > pagination.per_page && (
                        <Pagination
                           currentPage={pagination.current_page}
                           lastPage={pagination.last_page}
                           onPageChange={handlePageChange}
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