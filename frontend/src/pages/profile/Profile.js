import styles from './Profile.module.css';
import DefaultImg from '../../assets/images/default-profile.png';
import MainButton from '../../components/button/MainButton';
import TextInput from '../../components/inputFields/TextInput';
import Modal from '../../components/modal/Modal';
import Tabs from '../../components/tabs/Tabs';
import EmptyState from '../../components/UIStates/EmptyState';
import Pagination from '../../components/pagination/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';


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

   const [profileData, setProfileData] = useState({
      headerBg: null,
      profileImg: null,
      username: '',
      full_name: '',
      specialization: '',
      bio: '',
      location: '',
      languages: [],
      interests: [],
      partners: []
   });
   const navigate = useNavigate();
   const location = useLocation();
   const headerDropMenuRef = useRef(null);
   const imageInputRef = useRef(null);
   const editBtnRef = useRef(null);
   const tabs = ['Account', 'Partners'];
   const [searchParams] = useSearchParams();
   const activeTabFromURL = searchParams.get('tab') || 'account';
   const [activeTab, setActiveTab] = useState(activeTabFromURL);
   const [tempHeader, setTempHeader] = useState(null);
   const [isDropMenuOpened, setIsDropMenuOpened] = useState(false); // Edit header drop menu
   const [dragging, setDragging] = useState(false);
   const [bgPosition, setBgPosition] = useState({ x: 50, y: 50 }); // Center by default
   const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
   const [initialPosition, setInitialPosition] = useState({ x: 50, y: 50 });
   const [isModalOpened, setIsModalOpened] = useState(false);
   const [modalAction, setModalAction] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');
   const itemsPerPage = 9;
   const [currentItems, setCurrentItems] = useState(profileData.partners?.slice(0, itemsPerPage));


   // ----------- Handle clicking Upload Photo in Header ------------
   const handleUploadClick = () => {
      imageInputRef.current.click();
      setIsDropMenuOpened(false);
   };

   // -------------- Handle uploading new Header Image --------------
   const handleUploadImage = (e) => {
      if (e.target.files && e.target.files[0]) {
         const imgURL = URL.createObjectURL(e.target.files[0]);
         setTempHeader(imgURL);
         setBgPosition({ x: 50, y: 50 }); // Reset to center position on new upload
      }
   };

   // ------------ Control repositioning uploaded Header ------------
   const handleMouseDown = (e) => {
      if (tempHeader) { // Enable dragging only is image is not saved yet
         setDragging(true);
         setStartDragPosition({ x: e.clientX, y: e.clientY });
         setInitialPosition(bgPosition);
      }
   };
   const handleMouseMove = (e) => {
      if (!dragging || !tempHeader) return; // Only allow dragging if tempHeader exists
      const newX = e.clientX - startDragPosition.x;
      const newY = e.clientY - startDragPosition.y;
      setBgPosition({
         x: Math.max(0, Math.min(100, initialPosition.x + newX / 5)), // Dividing by 5 for smoother movement
         y: Math.max(0, Math.min(100, initialPosition.y + newY / 5))
      });
   };

   // ----------------- Setting a new Header Image ------------------
   const handleSaveHeaderBg = () => {
      setProfileData((prevState) => ({
         ...prevState,
         headerBg: tempHeader
      }));
      setTempHeader(null);
   };

   // --------------- Remove the current Header Image ---------------
   const handleRemoveHeaderBg = () => {
      setIsDropMenuOpened(false);
      setProfileData((prevState) => ({
         ...prevState,
         headerBg: null
      }))
   };

   // -------------- Control Opening Confirmation Modal -------------
   const OpenModal = (actionType) => {
      setModalAction(actionType);
      setIsModalOpened(true);
   };

   // ----------- Handle remove partner from partner list -----------
   const handleRemovePartner = () => {
      // Backend logic to remove partner from partner list 
   };

   // --------- Conditional render for modal confirm action ---------
   const modalConfirmAction = modalAction === 'removeHeader' ? handleRemoveHeaderBg : handleRemovePartner;

   // -------- Close menu when clicking outside the component -------
   const handleClickOutside = useCallback((e) => {
      if (editBtnRef && editBtnRef.current.contains(e.target)) return; // Ignore clicks on the edit button
      if (isDropMenuOpened && headerDropMenuRef && !headerDropMenuRef.current.contains(e.target)) {
         setIsDropMenuOpened(false);
      }
   }, [isDropMenuOpened]);


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

   // ------------ Fetch user profile information from DB -----------
   useEffect(() => {
      // Modified later with backend logic
      const fetchedData = {
         headerBg: null,
         profileImg: null,
         username: 'ola99',
         full_name: 'Ola Saber',
         specialization: 'Dentist',
         bio: 'I am interested in software and game development and constantly seek new knowledge and opportunities in different technical fields. I am dedicated to do my best work and bringing innovative ideas to life.',
         location: 'Saudi Arabia, Jeddah',
         languages: ['Arabic', 'English'],
         interests: ['Astronomy', 'Writing'],
         partners: [
            { full_name: 'Rana Hafez', username: 'ran87', specialization: 'Programmer' },
            { full_name: 'Doha Mohammed', username: 'dohamm', specialization: 'Writer' },
         ]
      }
      setProfileData(fetchedData);
   }, []);

   // ----------- Handle clicking outside the opened menu -----------
   useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [handleClickOutside]);

   // --------------- Change content on page change -----------------
   useEffect(() => {
      const getPageFromURL = () => {
         const searchParams = new URLSearchParams(location.search);
         const page = searchParams.get('page');
         return page ? parseInt(page, 10) : 1; // Return 1 as the default page
      };
      const handlePageClick = (startOffset) => {
         const newSlice = profileData.partners?.slice(startOffset, startOffset + itemsPerPage);
         setCurrentItems(newSlice);
      };

      const page = getPageFromURL();
      const startOffset = (page - 1) * itemsPerPage;
      handlePageClick(startOffset);
   }, [location.search, profileData.partners]);

   // ----------- Track empty state for each tab section ------------
   const isAccountEmpty = !profileData.bio && !profileData.location && !profileData.languages && !profileData.interests;
   const isPartnersEmpty = !profileData.partners || profileData.partners.length === 0;


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
               onMouseDown={handleMouseDown}
               onMouseMove={handleMouseMove}
               onMouseUp={() => setDragging(false)}
               style={{
                  backgroundImage: tempHeader
                     ? `url(${tempHeader})`
                     : profileData.headerBg
                        ? `url(${profileData.headerBg})`
                        : 'none',
                  backgroundColor: profileData.headerBg
                     ? 'transparent'
                     : 'var(--dark-grey-color)',
                  backgroundPosition: `${bgPosition.x}% ${bgPosition.y}%`,
                  cursor: tempHeader ? 'grabbing' : 'default'
               }}
            />

            {/* Edit header button and drop menu optinos */}
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

               <li onClick={() => OpenModal('removeHeader')}>
                  <FontAwesomeIcon icon="fa-regular fa-trash-can" />
                  <span className='small_font'> Remove </span>
               </li>
            </ul>
         </div>

         {/* --------------- Profile Body Content ---------------- */}
         <div className={styles.content_wrap}>
            {/* Profile image */}
            <div className={styles.profile_img}>
               <img src={profileData.profileImg ? profileData.profileImg : DefaultImg} alt="" />
            </div>

            {/* Username and specialization */}
            <div className={styles.desc_container}>
               <h3> {profileData.full_name ? profileData.full_name : profileData.username} </h3>
               <span> {profileData.specialization} </span>
               <FontAwesomeIcon
                  icon="fa-solid fa-pen"
                  className={styles.edit_icon}
                  onClick={() => navigate('/edit-account')}
               />
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
                        {profileData.bio && (
                           <AccountSection title="Bio" icon="fa-regular fa-user">
                              <p> {profileData.bio} </p>
                           </AccountSection>
                        )}

                        {profileData.location && (
                           <AccountSection title="Location" icon="fa-regular fa-flag">
                              <p> {profileData.location} </p>
                           </AccountSection>
                        )}

                        {profileData.languages && (
                           <AccountSection title="Languages" icon="fa-regular fa-comments">
                              <div className={styles.tags_container}>
                                 {profileData.languages.map((language, index) => (
                                    <div key={index} className={styles.tag}>
                                       <span className='small_font'> {language} </span>
                                    </div>
                                 ))}
                              </div>
                           </AccountSection>
                        )}

                        {profileData.interests && (
                           <AccountSection title="Interests" icon="fa-regular fa-heart">
                              <div className={styles.tags_container}>
                                 {profileData.interests.map((interest, index) => (
                                    <div key={index} className={styles.tag}>
                                       <span className='small_font'> {interest} </span>
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
                           <span className='small_font'> 24 results </span>
                           <TextInput
                              placeholder="Search by Name"
                              value={searchTerm}
                              icon="fa-solid fa-search"
                              onChange={(value) => setSearchTerm(value)}
                           />
                        </div>

                        {/* Partners list */}
                        {currentItems.map((partner, index) => (
                           <div key={index} className={`${styles.section} ${styles.partners}`}>
                              <div className={styles.left_subsection}>
                                 <div
                                    className={styles.partnet_img}
                                    onClick={() => navigate(`/profile/${partner.username}`)}
                                 >
                                    <img src={partner.profileImg ? partner.profileImg : DefaultImg} alt="" />
                                 </div>
                                 <div>
                                    <h4> {partner.full_name ? partner.full_name : partner.username} </h4>
                                    <span className='small_font'> {partner.specialization} </span>
                                 </div>
                              </div>

                              <div className={styles.right_subsection}>
                                 <MainButton
                                    label="Message"
                                    customStyles={{ minWidth: 'auto' }}
                                 />
                                 <FontAwesomeIcon
                                    icon="fa-solid fa-xmark"
                                    className={styles.remove_icon}
                                    onClick={() => OpenModal('removePartner')}
                                 />
                              </div>
                           </div>
                        ))}
                     </>
                  )
               )}
            </div>

            {/* Pagination section */}
            {(activeTab === 'partners' && profileData.partners?.length > itemsPerPage) && (
               <Pagination
                  itemsLength={profileData.partners?.length}
                  itemsPerPage={itemsPerPage}
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