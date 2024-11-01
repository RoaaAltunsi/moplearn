import styles from './CourseCategory.module.css';
import CourseImage from '../../assets/images/course-img-test.png';
import Filter from '../../components/filter/Filter';
import CourseCard from '../../components/courseCard/CourseCard';
import SelectInput from '../../components/inputFields/SelectInput';
import Pagination from '../../components/pagination/Pagination';
import EmptyState from '../../components/emptyState/EmptyState';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
   {
      id: 5,
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
      id: 6,
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
      id: 7,
      link: "https://www.udemy.com/course/php-mvc-from-scratch/",
      image: CourseImage,
      price: 14.99,
      oldPrice: 54.99,
      title: 'Write PHP Like a Pro: Build a PHP MVC Framework From Scratch',
      platformName: 'Udemy',
      rating: 4.8,
      ratingNum: 3093
   },
];


function CourseCategory() {

   const location = useLocation();
   const { courseCategory } = useParams();
   const [partnerChecked, setPartnerChecked] = useState({}); // For partner list checkbox
   const [filters, setFilters] = useState({
      price: { free: false, discounted: false },
      topic: {},
      level: { beginner: false, intermediate: false, expert: false },
      platform: {},
      language: {}
   });
   const [sortFilter, setSortFilter] = useState('');
   const itemsPerPage = 9;
   const [currentItems, setCurrentItems] = useState(courses.slice(0, itemsPerPage));


   // ----------- Format extracted category from URL -----------
   const formCourseCategory = (category) => {
      return category
         .split('-')
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


   // ------- Initialize some filters state dynamically --------
   useEffect(() => {
      // Replace it later with actual API call to fetch data
      const fetchedTopics = ['Web Development', 'App Development', 'Cybersecurity', 'AI'];
      const fetchedPlatforms = ['Udemy', 'Coursera', 'Harvard'];
      const fetchedLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Korean', 'Arabic'];

      const initialTopicFilters = {};
      fetchedTopics.forEach(topic => {
         initialTopicFilters[topic] = false;
      });
      const initialPlatformFilters = {};
      fetchedPlatforms.forEach(platform => {
         initialPlatformFilters[platform] = false;
      });
      const initialLanguageFilters = {};
      fetchedLanguages.forEach(language => {
         initialLanguageFilters[language] = false;
      });

      // Set the filters state
      setFilters(prevState => ({
         ...prevState,
         topic: initialTopicFilters,
         platform: initialPlatformFilters,
         language: initialLanguageFilters,
      }));
   }, []);

   // ------------- Change content on page change --------------
   useEffect(() => {
      const getPageFromURL = () => {
         const searchParams = new URLSearchParams(location.search);
         const page = searchParams.get('page');
         return page ? parseInt(page, 10) : 1; // Return 1 as the default page
      };
      const handlePageClick = (startOffset) => {
         const newSlice = courses.slice(startOffset, startOffset + itemsPerPage);
         setCurrentItems(newSlice);
      };

      const page = getPageFromURL();
      const startOffset = (page - 1) * itemsPerPage;
      handlePageClick(startOffset);
   }, [location.search])


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
                  <span className='small_font'> 5,370 results </span>
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
               {courses.length > 0 ? (
                  <>
                     <div className={styles.courses_grid}>
                        {currentItems.map(course => (
                           <CourseCard
                              key={course.id}
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
                        ))}
                     </div>

                     {/* Pagination section */}
                     {courses.length > itemsPerPage && (
                        <Pagination
                           itemsLength={courses.length}
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