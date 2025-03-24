import styles from './Profile.module.css';
import DefaultImg from '../../assets/images/default-profile.png';
import MainButton from '../../components/button/MainButton';
// import TextInput from '../../components/inputFields/TextInput';
import Modal from '../../components/modal/Modal';
import Tabs from '../../components/tabs/Tabs';
import EmptyState from '../../components/UIStates/EmptyState';
import Pagination from '../../components/pagination/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserByUsername } from '../../redux/slices/userSlice';
import { updateProfile } from '../../redux/slices/userProfileSlice';
import { toast } from 'react-toastify';
import { createFriendship, deleteFriendship, getFriends, getUserFriends } from '../../redux/slices/friendshipSlice';


// ------------ Account section component ------------
const AccountSection = ({ title, icon, children }) => {
   return (
      <div className={`${styles.section} ${styles.account}`}>
         <div className={styles.left_subsection}>
            <FontAwesomeIcon icon={icon} />
            <h4> {title} </h4>
         </div>
         <div className={styles.right_subsection}>
            {children}
         </div>
      </div>
   )
};


function Profile() {

   const itemsPerPage = 9;
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const location = useLocation();
   const headerDropMenuRef = useRef(null);
   const imageInputRef = useRef(null);
   const editBtnRef = useRef(null);
   const tabs = ['Account', 'Partners'];
   const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
   const activeTabFromURL = searchParams.get('tab') || 'account';
   const currentPage = parseInt(searchParams.get("page"), 10) || 1;
   const [activeTab, setActiveTab] = useState(activeTabFromURL);
   const [tempHeader, setTempHeader] = useState(null);
   const [isDropMenuOpened, setIsDropMenuOpened] = useState(false); // Edit header drop menu
   const [isModalOpened, setIsModalOpened] = useState(false);
   const [modalAction, setModalAction] = useState(null);
   // const [searchTerm, setSearchTerm] = useState('');
   const { username } = useParams(); // Get username from URL
   const { user, isAuthenticated } = useSelector((state) => state.auth);
   const { fullUsers } = useSelector((state) => state.user);
   const { myFriends, myPagination, userPagination, sentRequests, receivedRequests } = useSelector((state) => state.friendship);
   const isOwnProfile = isAuthenticated && user?.username === username;
   const pagination = isOwnProfile ? myPagination : userPagination;
   const [profileUser, setProfileUser] = useState(null);
   const [selectedPartner, setSelectedPartner] = useState(null); // for deleting friendship 


   // ----------- Handle clicking Upload Photo in Header ------------
   const handleUploadClick = () => {
      imageInputRef.current.click();
      setIsDropMenuOpened(false);
   };

   // -------------- Handle uploading new Header Image --------------
   const handleUploadImage = (e) => {
      const file = e.target.files[0];
      if (file) {
         setTempHeader(file);
      }
   };

   // --------------- Update URL on page change ----------------
   const handlePageChange = (newPage) => {
      searchParams.set("page", newPage);
      navigate(`${location.pathname}?${searchParams.toString()}`);
   };

   // ----------------- Setting a new Header Image ------------------
   const handleSaveHeaderBg = async () => {
      try {
         const formData = new FormData();
         formData.append('profile_background', tempHeader);
         const updatedUser = await dispatch(updateProfile(formData)).unwrap();
         // Update user object to reflect the change immediately
         setTempHeader(null);
         setProfileUser((prev) => ({
            ...prev,
            profile_background: updatedUser?.user?.profile_background
         }));
      } catch (err) {
         toast.error(err.error);
      }
   };

   // --------------- Remove the current Header Image ---------------
   const handleRemoveHeaderBg = async () => {
      setIsDropMenuOpened(false);
      try {
         await dispatch(updateProfile({ 'remove_background': 1 })).unwrap();
         setIsModalOpened(false);
         setProfileUser((prev) => ({
            ...prev,
            profile_background: null
         }));
      } catch (err) {
         toast.error(err.error);
      }
   };

   // -------------- Control Opening Confirmation Modal -------------
   const OpenModal = (actionType) => {
      setModalAction(actionType);
      setIsModalOpened(true);
   };

   // ----------- Handle remove partner from partner list -----------
   const handleRemovePartner = async () => {
      try {
         await dispatch(deleteFriendship({ id: selectedPartner, status: 'accepted' })).unwrap();
         setIsModalOpened(false);
         toast.success("This user is successfully deleted from your list!");
      } catch (err) {
         toast.error(err.error);
      }
   };

   // --------- Handle send friendship request to this user ---------
   const handleSendFriendshipRequest = async () => {
      try {
         await dispatch(createFriendship({ receiver_id: profileUser?.id })).unwrap();
         toast.success("Friend request sent successfully");
      } catch (err) {
         toast.error(err.error);
      }
   };

   // --------- Conditional render for modal confirm action ---------
   const modalConfirmAction = modalAction === 'removeHeader' ? handleRemoveHeaderBg : handleRemovePartner;

   // -------- Close menu when clicking outside the component -------
   const handleClickOutside = useCallback((e) => {
      if (isOwnProfile) {
         if (editBtnRef && editBtnRef?.current.contains(e.target)) return; // Ignore clicks on the edit button
         if (isDropMenuOpened && headerDropMenuRef && !headerDropMenuRef.current.contains(e.target)) {
            setIsDropMenuOpened(false);
         }
      }
   }, [isDropMenuOpened, isOwnProfile]);


   // Synchronize state with URL query parameters on mount and back/forward navigation
   useEffect(() => {
      setActiveTab(activeTabFromURL);
   }, [activeTabFromURL]);

   // -------------- Update URL when changing the tab --------------
   useEffect(() => {
      const formattedTab = activeTab.toLowerCase().replaceAll(' ', '-');
      if (formattedTab !== searchParams.get('tab')) {
         navigate(`?tab=${formattedTab}`, { replace: true }); // Use replace to avoid unnecessary history entries
      }
   }, [activeTab, navigate, searchParams]);

   // ----------- Handle clicking outside the opened menu -----------
   useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [handleClickOutside]);

   // ------------ Fetch user object to display profile -------------
   const hasFetched = useRef(false);
   useEffect(() => {
      // User onw profile
      if (isOwnProfile) {
         setProfileUser(user);
         return;
      }

      // Other users profile
      const fullUserObj = fullUsers?.[username];
      if (fullUserObj) {
         setProfileUser(fullUserObj);
         return;
      }

      if (!hasFetched.current) {
         hasFetched.current = true;
         dispatch(getUserByUsername(username)).then((response) => {
            setProfileUser(response?.payload);
         });
      }
   }, [dispatch, username, isOwnProfile, user, fullUsers]);

   // ---------------- Fetch partner list for user ------------------
   useEffect(() => {
      if (activeTab !== 'partners' || !profileUser?.id) return;

      const fetchFriends = async () => {
         let friends = [];
         // User own friends
         if (isOwnProfile) {
            if (myFriends.length === 0) {
               await dispatch(getFriends({ user_id: profileUser?.id, page: currentPage, size: itemsPerPage }))
                  .then((response) => { friends = response?.payload?.friends });
            } else {
               friends = myFriends;
            }

         } else {
            // Other users friends
            if (profileUser?.partners) return
            await dispatch(getUserFriends({ user_id: profileUser?.id, page: currentPage, size: itemsPerPage }))
               .then((response) => { friends = response?.payload?.friends });
         }
         setProfileUser((prev) => ({ ...prev, partners: friends }));
      };

      fetchFriends();
   }, [dispatch, activeTab, isOwnProfile, myFriends, currentPage, profileUser?.partners, profileUser?.id]);


   // ------------ Control displaying add partner icon --------------
   const isNotPartner = useMemo(() => {
      if (!profileUser?.id) return false;
      const userId = profileUser.id;
      const isFriend = myFriends?.some(f => f.user?.id === userId);
      const isSent = sentRequests?.some(r => r.user?.id === userId);
      const isReceived = receivedRequests?.some(r => r.user?.id === userId);
      return !isFriend && !isSent && !isReceived;
   }, [profileUser?.id, myFriends, sentRequests, receivedRequests]);

   // ----------- Track empty state for each tab section ------------
   const isAccountEmpty = !profileUser?.bio
      && !profileUser?.location
      && (profileUser?.languages?.length || 0) === 0
      && (profileUser?.interests?.length || 0) === 0;
   const isPartnersEmpty = !profileUser?.partners || profileUser?.partners.length === 0;


   return (
      <div className='container'>

         {/* ------------- Header Background Section ------------- */}
         <div className={styles.header}>
            {/* Save/Cancel uploaded image */}
            {tempHeader && (
               <div className={styles.save_changes_box}>
                  <MainButton
                     label="Cancel"
                     backgroundColor="rgba(0, 0, 0, 0.2)"
                     borderStyles="1px solid var(--dark-grey-color)"
                     customStyles={{ minWidth: 'auto' }}
                     onClick={() => setTempHeader(null)}
                  />
                  <MainButton
                     label="Save"
                     onClick={handleSaveHeaderBg}
                  />
               </div>
            )}

            {/* Header background image */}
            <div
               className={styles.header_bg}
               style={{
                  backgroundImage: tempHeader
                     ? `url(${URL.createObjectURL(tempHeader)})`
                     : profileUser?.profile_background
                        ? `url(${profileUser?.profile_background})`
                        : 'none',
                  backgroundColor: profileUser?.profile_background
                     ? 'transparent'
                     : 'var(--dark-grey-color)',
               }}
            />

            {/* Edit header button and drop menu optinos */}
            {isOwnProfile && (
               <>
                  <div
                     ref={editBtnRef}
                     className={`${styles.edit_btn} ${tempHeader ? '' : styles.visible}`}
                     onClick={() => setIsDropMenuOpened(!isDropMenuOpened)}
                  >
                     <FontAwesomeIcon icon="fa-solid fa-pen" />
                     <span> Edit Header </span>
                  </div>

                  <ul
                     ref={headerDropMenuRef}
                     className={`${styles.edit_menu} ${isDropMenuOpened ? styles.visible : ''}`}
                  >
                     <li onClick={handleUploadClick}>
                        <FontAwesomeIcon icon="fa-solid fa-arrow-up-from-bracket" />
                        <span className='small_font'> Upload Photo </span>
                        <input
                           type="file"
                           ref={imageInputRef}
                           style={{ display: 'none' }}
                           accept=".jpg, .jpeg, .png"
                           onChange={handleUploadImage}
                        />
                     </li>

                     {profileUser?.profile_background && (
                        <li onClick={() => OpenModal('removeHeader')}>
                           <FontAwesomeIcon icon="fa-regular fa-trash-can" />
                           <span className='small_font'> Remove </span>
                        </li>
                     )}
                  </ul>
               </>
            )}

         </div>

         {/* --------------- Profile Body Content ---------------- */}
         <div className={styles.content_wrap}>
            {/* Profile image */}
            <div className={styles.profile_img}>
               <img src={profileUser?.image ? profileUser.image : DefaultImg} alt="" />
            </div>

            {/* Username and specialization */}
            <div className={styles.desc_container}>
               <h3> {profileUser?.full_name ? profileUser?.full_name : profileUser?.username} </h3>
               <span> {profileUser?.specialization} </span>
               {isOwnProfile ? (
                  <FontAwesomeIcon
                     icon="fa-solid fa-pen"
                     className={styles.edit_icon}
                     onClick={() => navigate('/edit-account')}
                  />
               ) :
                  isNotPartner ? (
                     <FontAwesomeIcon
                        icon="fa-solid fa-user-plus"
                        className={styles.edit_icon}
                        onClick={handleSendFriendshipRequest}
                     />
                  ) : null}
            </div>

            {/* Tabs switch */}
            <Tabs
               tabs={tabs}
               activeTab={activeTab}
               onTabChange={(tab) => setActiveTab(tab)}
            />

            <div className={styles.info_container}>
               {activeTab === 'account' ? (
                  // Account section
                  isAccountEmpty ? (
                     <EmptyState />
                  ) : (
                     <>
                        {profileUser?.bio && (
                           <AccountSection title="Bio" icon="fa-regular fa-user">
                              <p> {profileUser?.bio} </p>
                           </AccountSection>
                        )}

                        {profileUser?.location && (
                           <AccountSection title="Location" icon="fa-regular fa-flag">
                              <p> {profileUser?.location} </p>
                           </AccountSection>
                        )}

                        {profileUser?.languages.length > 0 && (
                           <AccountSection title="Languages" icon="fa-regular fa-comments">
                              <div className={styles.tags_container}>
                                 {profileUser?.languages.map((lang) => (
                                    <div key={lang.id} className={styles.tag}>
                                       <span className='small_font'> {lang.language} </span>
                                    </div>
                                 ))}
                              </div>
                           </AccountSection>
                        )}

                        {profileUser?.interests.length > 0 && (
                           <AccountSection title="Interests" icon="fa-regular fa-heart">
                              <div className={styles.tags_container}>
                                 {profileUser?.interests.map((interest) => (
                                    <div key={interest.id} className={styles.tag}>
                                       <span className='small_font'> {interest.title} </span>
                                    </div>
                                 ))}
                              </div>
                           </AccountSection>
                        )}
                     </>
                  )

               ) : (
                  // Partners section
                  isPartnersEmpty ? (
                     <EmptyState />
                  ) : (
                     <>
                        {/* Results number && Search input field */}
                        <div className={styles.partners_header}>
                           <span className='small_font'> {
                              isOwnProfile ? myPagination?.total : userPagination?.total
                           } results </span>
                           {/* <TextInput
                              placeholder="Search by Name"
                              value={searchTerm}
                              icon="fa-solid fa-search"
                              onChange={(value) => setSearchTerm(value)}
                           /> */}
                        </div>

                        {/* Partners list */}
                        {profileUser?.partners?.map((partner) => (
                           <div key={partner.id} className={`${styles.section} ${styles.partners}`}>
                              <div className={styles.left_subsection}>
                                 <div
                                    className={styles.partnet_img}
                                    onClick={() => navigate(`/profile/${partner.user?.username}`)}
                                 >
                                    <img src={partner.user?.image ? partner.user?.image : DefaultImg} alt="" />
                                 </div>
                                 <div>
                                    <h4> {partner.user?.full_name ? partner.user?.full_name : partner.user?.username} </h4>
                                    <span className='small_font'> {partner.user?.specialization} </span>
                                 </div>
                              </div>

                              {isOwnProfile && (
                                 <div className={styles.right_subsection}>
                                    <MainButton
                                       label="Message"
                                       customStyles={{ minWidth: 'auto' }}
                                    />
                                    <FontAwesomeIcon
                                       icon="fa-solid fa-xmark"
                                       className={styles.remove_icon}
                                       onClick={() => {
                                          setSelectedPartner(partner.id);
                                          OpenModal('removePartner')
                                       }}
                                    />
                                 </div>
                              )}
                           </div>
                        ))}
                     </>
                  )
               )}
            </div>

            {/* Pagination section */}
            {(activeTab === 'partners' && pagination.total > pagination.per_page) && (
               <Pagination
                  currentPage={pagination.current_page}
                  lastPage={pagination.last_page}
                  onPageChange={handlePageChange}
               />
            )}
         </div>

         {/* ---------------- Confirmation Modal ----------------- */}
         <Modal
            title="Confirmation"
            isOpen={isModalOpened}
            onClose={() => setIsModalOpened(false)}
            children={
               <>
                  <span> Are you sure you want to remove
                     {modalAction === 'removeHeader' ? ' your header photo' : ' this partner'}?
                  </span>
                  <div className={styles.modal_btns}>
                     <MainButton
                        label="Cancel"
                        backgroundColor="transparent"
                        borderStyles="1px solid var(--dark-grey-color)"
                        color="var(--dark-grey-color)"
                        customStyles={{ minWidth: 'auto' }}
                        onClick={() => setIsModalOpened(false)}
                     />
                     <MainButton
                        label="Confirm"
                        customStyles={{ minWidth: 'auto' }}
                        onClick={modalConfirmAction}
                     />
                  </div>
               </>
            }
         />

      </div>
   );
}

export default Profile;