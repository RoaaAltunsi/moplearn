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
import { getUserCourses, getUsers, resetUsers } from '../../redux/slices/userSlice';
import { getAllTopics } from '../../redux/slices/topicSlice';
import { createFriendship, deleteFriendship, getFriendsSummaries, getReceivedRequestSummaries, getSentRequestSummaries } from '../../redux/slices/friendshipSlice';
import { toast } from 'react-toastify';
import { addToPartnerList, removeFromPartnerList } from '../../redux/slices/courseSlice';


function FindPartner() {

   const location = useLocation();
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { user, isAuthenticated } = useSelector((state) => state.auth);
   const { users, pagination, userCourseIds } = useSelector((state) => state.user);
   const { friendReqSummaries, receivedReqSummaries, sentRequestsSummaries } = useSelector((state) => state.friendship);
   const { languages } = useSelector((state) => state.language);
   const { topics } = useSelector((state) => state.topic);
   const { courseTitle } = useParams();
   const searchParams = new URLSearchParams(location.search);
   const selectedLang = searchParams.get('language') || '';
   const selectedTopic = searchParams.get('topic') || '';
   const [partnerChecked, setPartnerChecked] = useState(false); // For partner list checkbox
   const currentPage = parseInt(searchParams.get("page"), 10) || 1;
   const courseId = Number(searchParams.get("courseId"));


   // ----------- Add/Remove user from partner list -----------
   const handlePartnerCheckboxChange = async (courseId, isChecked) => {
      try {
         setPartnerChecked(isChecked);

         isChecked
            ? await dispatch(addToPartnerList({ user_id: user?.id, course_id: courseId })).unwrap()
            : await dispatch(removeFromPartnerList({ user_id: user?.id, course_id: courseId })).unwrap();

      } catch (err) {
         toast.error(err.error);
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

   // ------------ Handle change friendship requests ------------
   const handleFriendshipOperations = async (data) => {
      try {
         if (data?.status === 'none') {
            // Create new Friendship request
            await dispatch(createFriendship({ receiver_id: data?.id })).unwrap();
            toast.success("Partnership request sent successfully");

         } else {
            // Delete existing friendship request
            await dispatch(deleteFriendship({ id: data?.id, status: data?.status })).unwrap();
            toast.success("The Partnership removed successfully");
         }

      } catch (err) {
         toast.error(err.error);
      }
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
         return isAuthenticated && (users.length === 0 || selectedLang || selectedTopic || courseId || currentPage > 1);
      };

      if (shouldFetchUsers()) {
         dispatch(getUsers(transformFiltersToQueryParams()));
      }
   }, [dispatch, transformFiltersToQueryParams, isAuthenticated, selectedLang, selectedTopic, courseId, currentPage, users.length]);

   // --------------- Fetch topics on page load ---------------
   useEffect(() => {
      if (topics?.length === 0 && isAuthenticated) {
         dispatch(getAllTopics());
      }
   }, [dispatch, topics?.length, isAuthenticated]);

   // ---------- Fetch user registered courses -----------
   useEffect(() => {
      if (isAuthenticated && courseId) {
         if (userCourseIds?.length === 0) {
            dispatch(getUserCourses(user?.id)).then((response) => {
               setPartnerChecked(!!response.payload.find(id => id === courseId));
            });

         } else {
            setPartnerChecked(!!userCourseIds.find(id => id === courseId));
         }
      }
   }, [dispatch, userCourseIds, user?.id, isAuthenticated, courseId]);

   // -------- Fetch friendship requests on page load ---------
   useEffect(() => {
      if (!isAuthenticated) return;

      if (friendReqSummaries?.length === 0) {
         dispatch(getFriendsSummaries(user?.id));
      }
      if (receivedReqSummaries.length === 0) {
         dispatch(getReceivedRequestSummaries());
      }
      if (sentRequestsSummaries.length === 0) {
         dispatch(getSentRequestSummaries());
      }
   }, [dispatch, isAuthenticated, user?.id, friendReqSummaries?.length, receivedReqSummaries?.length, sentRequestsSummaries?.length]);

   // -- Get friendship status for this user with all users ---
   const getFriendshipStatus = useCallback((userId) => {
      const friend = friendReqSummaries.find(req => req.user_id === userId);
      if (friend) return { status: 'accepted', user_id: friend.id };

      const received = receivedReqSummaries.find(req => req.user_id === userId);
      if (received) return { status: 'received', id: received.id };

      const sent = sentRequestsSummaries.find(req => req.user_id === userId);
      if (sent) return { status: 'sent', id: sent.id };

      return { status: 'none', id: userId };
   }, [friendReqSummaries, receivedReqSummaries, sentRequestsSummaries]);

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
                        {!!courseId && (
                           <CheckboxInput
                              label="Add Me to Partner List"
                              isChecked={partnerChecked}
                              onChange={(isChecked) => handlePartnerCheckboxChange(courseId, isChecked)}
                           />
                        )}
                        <SelectInput
                           label="Interests"
                           value={selectedTopic}
                           options={topics?.map(topic => topic.title)}
                           onChange={handleTopicChange}
                        />
                        <SelectInput
                           label="Language"
                           value={selectedLang}
                           options={languages?.map(language => language.language)}
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
                                 friendshipReq={getFriendshipStatus(partner.id)}
                                 handleFriendship={(data) => handleFriendshipOperations(data)}
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