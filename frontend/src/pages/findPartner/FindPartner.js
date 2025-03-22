import styles from './FindPartner.module.css';
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CurvedLine from '../../components/curvedLine/CurvedLine';
import SelectInput from '../../components/inputFields/SelectInput';
import CheckboxInput from '../../components/inputFields/CheckboxInput';
import PartnerCard from '../../components/partnerCard/PartnerCard';
import Pagination from '../../components/pagination/Pagination';
import EmptyState from '../../components/UIStates/EmptyState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import MainButton from '../../components/button/MainButton';
import { getUsers, resetUsers } from '../../redux/slices/userSlice';
import { getAllTopics } from '../../redux/slices/topicSlice';


function FindPartner() {

   const location = useLocation();
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { isAuthenticated } = useSelector((state) => state.auth);
   const { users, pagination } = useSelector((state) => state.user);
   const { languages } = useSelector((state) => state.language);
   const { topics } = useSelector((state) => state.topic);
   const { courseTitle } = useParams();
   const searchParams = new URLSearchParams(location.search);
   const selectedLang = searchParams.get('language') || '';
   const selectedTopic = searchParams.get('topic') || '';
   const [partnerChecked, setPartnerChecked] = useState(false); // For partner list checkbox
   const [friendList, setFriendList] = useState([]); // LATER: Fetch user's friend list from DB
   const currentPage = parseInt(searchParams.get("page"), 10) || 1;
   const courseId = searchParams.get("courseId");


   // ----------- Add/Remove user from partner list -----------
   const handlePartnerCheckboxChange = (value) => {
      setPartnerChecked(!partnerChecked);

      if (value) {
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

   // -------- Update content on language filter change ---------
   const handleLanguageChange = (value) => {
      searchParams.set('language', value);
      handlePageChange(1); // reset page
   };

   // -------- Update content on language filter change ---------
   const handleTopicChange = (value) => {
      searchParams.set('topic', value);
      handlePageChange(1); // reset page
   };

   // ---------- Format filters for backend end point -----------
   const transformFiltersToQueryParams = useCallback(() => {
      const params = {};

      // Course Filter
      if (courseId) params.course = courseId;

      // Language Filter
      if (selectedLang) {
         const langId = languages.find(lang => lang.language === selectedLang)?.id;
         if (langId) params.language = langId;
      }

      // Topic Filter
      if (selectedTopic) {
         const topicId = topics.find(topic => topic.title === selectedTopic)?.id;
         if (topicId) params.topic = topicId;
      }

      // Page Parameter
      if (currentPage) params.page = currentPage;

      return params;
   }, [currentPage, languages, selectedLang, topics, selectedTopic, courseId]);


   // ---------- Fetch partners when filters change -----------
   useEffect(() => {
      const shouldFetchUsers = () => {
         return users.length === 0 || selectedLang || selectedTopic || courseId || currentPage > 1;
      };

      if (shouldFetchUsers()) {
         dispatch(getUsers(transformFiltersToQueryParams()));
      }
   }, [dispatch, transformFiltersToQueryParams, selectedLang, selectedTopic, courseId, currentPage, users.length]);
   
   // --------------- Fetch topics on page load ---------------
   useEffect(() => {
      if (topics.length === 0 && isAuthenticated) {
         dispatch(getAllTopics());
      }
   }, [dispatch, topics.length, isAuthenticated]);

   // - Reset users when leaving the page with active filters -
   useEffect(() => {
      return () => {
         const searchParams = new URLSearchParams(location.search);
         const hasActiveFilters = searchParams.get('language') || searchParams.get('topic') || searchParams.get('courseId');
   
         if (hasActiveFilters) {
            dispatch(resetUsers());
         }
      };
   }, [dispatch, location.search]);
   

   return (
      <div className='container'>
         <div className={styles.content_wrap}>

            {/* ------------ Title && Cureved Line ------------ */}
            <h2> Find Someone to Learn With! </h2>
            {courseTitle && (
               <span className='small_font'>
                  {`Course: ${courseTitle.replaceAll('-', ' ')} `}
               </span>
            )}
            <div className={styles.line_container}>
               <CurvedLine />
            </div>

            {isAuthenticated ? (
               <>
                  {/* ----------- Resutls / Filters Header ---------- */}
                  <div className={styles.header}>
                     {/* Left sub-section */}
                     <span className='small_font'> {pagination.total} results </span>

                     {/* Right sub-section */}
                     <div className={styles.inputs}>
                        {courseId && (
                           <CheckboxInput
                              label="Add Me to Partner List"
                              isChecked={partnerChecked}
                              onChange={(value) => handlePartnerCheckboxChange(value)}
                           />
                        )}
                        <SelectInput
                           label="Interests"
                           value={selectedTopic}
                           options={topics.map(topic => topic.title)}
                           onChange={handleTopicChange}
                        />
                        <SelectInput
                           label="Language"
                           value={selectedLang}
                           options={languages.map(language => language.language)}
                           onChange={handleLanguageChange}
                        />
                     </div>
                  </div>

                  {/* ---------- Partners Cards Container ----------- */}
                  {users.length > 0 ? (
                     <>
                        <div className={styles.partners_grid}>
                           {users.map(partner => (
                              <PartnerCard
                                 key={partner.id}
                                 id={partner.id}
                                 fullName={partner.full_name}
                                 username={partner.username}
                                 image={partner.image}
                                 specialization={partner.specialization}
                                 interests={partner.interests}
                                 isFriend={friendList.includes(partner.id)}
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
               </>

            ) : (
               // ----------- Ask user to login -----------
               <div className={'login_ask_container'}>
                  <FontAwesomeIcon icon="fa-solid fa-users" className={'icon'} />
                  <p>Please log in to browse partners</p>
                  <MainButton
                     label="Log in"
                     onClick={() => navigate('/login', { state: { from: location.pathname } })}
                  />
               </div>
            )}

         </div>
      </div>
   );
}

export default FindPartner;