import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Filter.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CheckboxInput from '../inputFields/CheckboxInput';
import MainButton from '../button/MainButton';

function Filter({
   filters,
   onFilterChange,
   onClearFilters,
}) {

   const filterMenuRef = useRef(null);
   const filtersRef = useRef(filters); // Avoids the need to include 'filters' in dependency array, preventing unnecessary renders
   const [filterOpened, setFilterOpened] = useState({});
   const maxVisibleOptions = 4; // Max number of options before displaying "show more"
   const [isExpanded, setIsExpanded] = useState({}); // State to handle "Show more" / "Show less"
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);


   // -------------- Handle Opening/Closing each filter --------------
   const toggleFilterView = (section) => {
      setFilterOpened(prevState => ({
         ...prevState,
         [section]: !prevState[section]
      }));
   }

   // ---------- Handle show More/Less for filter's options ----------
   const toggleShowList = (filter) => {
      setIsExpanded(prevState => ({
         ...prevState,
         [filter]: !prevState[filter]
      }));
   }

   // -------- Close menu when clicking outside the component --------
   const handleClickOutside = useCallback((e) => {
      if (isMobileFilterOpen && filterMenuRef?.current && !filterMenuRef.current.contains(e.target)) {
         setIsMobileFilterOpen(false);
      }
   }, [isMobileFilterOpen]);


   // ---------------- Set initial states for filters -----------------
   useEffect(() => {
      Object.keys(filtersRef.current).forEach((filter, index) => {
         setFilterOpened(prevState => ({
            ...prevState,
            [filter]: index === 0 || index === 1 // Make the first two filters opened
         }))

         setIsExpanded(prevState => ({
            ...prevState,
            [filter]: false // Start with showing less
         }))
      })
   }, []);

   // ----- Ensure mobile menu only appear in Tablet/Mobile mode ------
   useEffect(() => {
      const handleResize = () => {
         setIsMobile(window.innerWidth <= 768);
         if (window.innerWidth > 768) {
            setIsMobileFilterOpen(false);
         }
      };

      window.addEventListener('resize', handleResize);
      return () => {
         window.removeEventListener('resize', handleResize);
      }
   }, [])

   // ------- Prevent scrolling when mobile menu is opened ------------
   useEffect(() => {
      if (isMobileFilterOpen) {
         document.body.classList.add('no_scroll');
      } else {
         document.body.classList.remove('no_scroll');
      }
   }, [isMobileFilterOpen])

   // ---------- Handle clicking outside the opened menu --------------
   useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      }
   }, [handleClickOutside])


   return (
      <div className={styles.container}>

         {/* Custom elements only in Tablet/Mobile mode */}
         {isMobile && (
            <MainButton
               label="Filters"
               width="100%"
               backgroundColor="var(--white-color)"
               color="var(--secondary-color)"
               borderStyles="1px solid var(--secondary-color)"
               onClick={() => setIsMobileFilterOpen(true)}
            />
         )}
         {isMobileFilterOpen && (
            <div className={styles.transparent_background} />
         )}

         {/* Filter main content (body) */}
         <div
            ref={filterMenuRef}
            className={`${styles.filter_menu_container} ${isMobileFilterOpen ? styles.open : ''}`}
         >
            {/* --------------- Header Section --------------- */}
            <div className={styles.header}>
               <div className={styles.close_container}>
                  <h3> Filters </h3>
                  {isMobileFilterOpen && (
                     <FontAwesomeIcon
                        icon="fa-solid fa-xmark"
                        onClick={() => setIsMobileFilterOpen(false)}
                        className={styles.icon}
                     />
                  )}
               </div>

               {/* Clear filters button */}
               <div className={styles.clear_btn} onClick={onClearFilters}>
                  <FontAwesomeIcon icon="fa-solid fa-eraser" />
                  <span> Clear Filters </span>
               </div>
            </div>

            {/* -------------- Filters Container ------------- */}
            <div className={styles.filters_container}>
               {Object.keys(filters).map((filter, index) => {
                  const numOptions = Object.keys(filters[filter]).length;

                  return (
                     <div key={index} className={styles.filter_item}>
                        {/* -------------- Filter title -------------- */}
                        <div
                           onClick={() => toggleFilterView(filter)}
                           className={styles.filter_header}
                        >
                           <h4> {filter.charAt(0).toUpperCase() + filter.slice(1)} </h4>
                           <FontAwesomeIcon icon={`fa-solid fa-chevron-${filterOpened[filter] ? 'up' : 'down'}`} />
                        </div>

                        {/* -------------- Collapsible list -------------- */}
                        {filterOpened[filter] && (
                           <div>
                              {/* Options list */}
                              <div className={`
                                 ${styles.options_container} 
                                 ${(numOptions > maxVisibleOptions && !isExpanded[filter]) ? styles.blurred : ''}
                              `}>
                                 {Object.keys(filters[filter])
                                    .slice(0, isExpanded[filter] ? numOptions : maxVisibleOptions)
                                    .map((option, idx) => (
                                       <CheckboxInput
                                          key={idx}
                                          label={option.charAt(0).toUpperCase() + option.slice(1)}
                                          isChecked={filters[filter][option]}
                                          onChange={() => onFilterChange(filter, option)}
                                       />
                                    ))
                                 }
                              </div>

                              {/* Show more/less button */}
                              {numOptions > maxVisibleOptions && (
                                 <div
                                    className={styles.show_more_btn}
                                    onClick={() => toggleShowList(filter)}
                                 >
                                    <span className='small_font'> Show {isExpanded[filter] ? 'less' : 'more'} </span>
                                    <FontAwesomeIcon
                                       icon={`fa-solid fa-chevron-${isExpanded[filter] ? 'up' : 'down'}`}
                                       className={styles.icon}
                                    />
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
   );
}

export default Filter;