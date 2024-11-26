import styles from './EditAccount.module.css';
import Tabs from '../../components/tabs/Tabs';
import DefaultImg from '../../assets/images/default-profile.png';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import MainButton from '../../components/button/MainButton';
import TextInput from '../../components/inputFields/TextInput';
import SelectInput from '../../components/inputFields/SelectInput';
import Modal from '../../components/modal/Modal';
import useFormFields from '../../hooks/useFormFields';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const languages = [
   'English', 'Arabic', 'Chinese', 'Italian', 'French', 'Korean', 'Japanese', 'Russian', 'Turkish',
   'Spanish', 'German', 'Hindi', 'Portuguese', 'Swedish', 'Ukranian', 'Greek', 'Dutch', 'Tahi'
];

const interests = [
   'Design', 'Programming', 'Gaming', 'Writing', 'Physics', 'Game Development'
];


function EditAccount() {

   const initialValues = {
      profile_img: null,
      first_name: '',
      last_name: '',
      specialization: '',
      location: '',
      bio: '',
      languages: [],
      interests: [],
      username: '',
      email: '',
   };
   const navigate = useNavigate();
   const imageInputRef = useRef(null);
   const editBtnRef = useRef(null);
   const profileImgDropMenuRef = useRef(null);
   const { fields, handleChange } = useFormFields(initialValues);
   const tabs = ['Profile Info', 'Settings'];
   const [searchParams] = useSearchParams();
   const activeTabFromURL = searchParams.get('tab') || 'profile-info';
   const [activeTab, setActiveTab] = useState(activeTabFromURL);
   const [tempProfileImg, setTempProfileImg] = useState(null);
   const [isDropMenuOpened, setIsDropMenuOpened] = useState(false); // Edit profile img drop menu
   const [isModalOpened, setIsModalOpened] = useState(false);


   // ------- Handle clicking Upload Photo in edit profile img --------
   const handleUploadClick = () => {
      imageInputRef.current.click();
      setIsDropMenuOpened(false);
   };

   // --------------- Handle uploading new Profile Image --------------
   const handleUploadImage = (e) => {
      if (e.target.files && e.target.files[0]) {
         const imgURL = URL.createObjectURL(e.target.files[0]);
         setTempProfileImg(imgURL);
      }
   };

   // ------------------- Handle Remove Profile Image -----------------
   const handleRemoveProfileImg = () => {
      setIsDropMenuOpened(false);
      setTempProfileImg(null);
   };

   // ------------------- Handle Remove user account ------------------
   const handleRemoveAccount = () => {

   };

   // --------- Close menu when clicking outside the component --------
   const handleClickOutside = useCallback((e) => {
      if (editBtnRef && editBtnRef.current?.contains(e.target)) return; // Ignore clicks on the edit button
      if (isDropMenuOpened && profileImgDropMenuRef && !profileImgDropMenuRef.current.contains(e.target)) {
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

   // ----------- Handle clicking outside the opened menu -----------
   useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [handleClickOutside]);


   return (
      <div className='container'>
         <div className={styles.content_wrap}>
            {/* ---------------- Tabs Switch ----------------- */}
            <Tabs
               tabs={tabs}
               activeTab={activeTab}
               onTabChange={setActiveTab}
            />

            <div className={styles.info_container}>
               {activeTab === 'profile-info' ? (
                  <>
                     {/* ------------ Edit Profile Image ----------- */}
                     <div className={styles.section}>
                        <div className={styles.profile_img}>
                           <img src={tempProfileImg ? tempProfileImg : DefaultImg} alt="" />
                           {/* Edit button */}
                           <div ref={editBtnRef} className={styles.edit_img_btn}>
                              <MainButton
                                 isCircular={true}
                                 iconName="fa-solid fa-pen"
                                 onClick={() => setIsDropMenuOpened(!isDropMenuOpened)}
                              />
                           </div>

                           {/* Edit dropdown menu */}
                           <ul
                              ref={profileImgDropMenuRef}
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

                              <li onClick={handleRemoveProfileImg}>
                                 <FontAwesomeIcon icon="fa-regular fa-trash-can" />
                                 <span className='small_font'> Remove </span>
                              </li>
                           </ul>
                        </div>
                     </div>

                     {/* -------- Profile Info Input Fields -------- */}
                     <div className={styles.section}>
                        <h4> Personal Information </h4>
                        <div className={styles.flex_row}>
                           <TextInput
                              label="First Name"
                              value={fields['first_name']}
                              onChange={(value) => handleChange('first_name', value)}
                           />
                           <TextInput
                              label="Last Name"
                              value={fields['last_name']}
                              onChange={(value) => handleChange('last_name', value)}
                           />
                        </div>

                        <div className={styles.flex_row}>
                           <TextInput
                              label="Specialization"
                              value={fields['specialization']}
                              onChange={(value) => handleChange('specialization', value)}
                           />
                           <TextInput
                              label="Location"
                              value={fields['locatione']}
                              onChange={(value) => handleChange('location', value)}
                           />
                        </div>

                        <div className={styles.flex_row}>
                           <TextInput
                              isMulitLine={true}
                              label="Bio"
                              value={fields['bio']}
                              onChange={(value) => handleChange('bio', value)}
                           />
                        </div>
                     </div>

                     <div className={styles.section}>
                        <h4> Preference </h4>
                        <div>
                           <SelectInput
                              isMultiOptions={true}
                              label="Languages"
                              value={fields['languages']}
                              options={languages}
                              onChange={(value) => handleChange('languages', value)}
                           />
                        </div>

                        <div>
                           <SelectInput
                              isMultiOptions={true}
                              label="Interests"
                              value={fields['interests']}
                              options={interests}
                              onChange={(value) => handleChange('interests', value)}
                           />
                        </div>
                     </div>

                     <div className={styles.section}>
                        <MainButton
                           label="Save Changes"
                           customStyles={{ alignSelf: 'flex-start' }}
                        />
                     </div>
                  </>

               ) : (
                  <>
                     <div className={styles.section}>
                        <div className={styles.flex_row}>
                           <TextInput
                              label="Username"
                              value={fields['username']}
                              onChange={(value) => handleChange('username', value)}
                           />
                           <TextInput
                              label="Email"
                              value={fields['email']}
                              onChange={(value) => handleChange('email', value)}
                           />
                        </div>

                        <MainButton
                           label="Save Changes"
                           customStyles={{ alignSelf: 'flex-start', margin: '3vh 0' }}
                        />
                     </div>

                     <div className={`${styles.section} ${styles.delete_sec}`}>
                        <h3> Delete Account </h3>
                        <span className='small_font'> Once you delete your account, there is no going back. Please be certain </span>
                        <MainButton
                           isDestructive={true}
                           label="Delete My Account"
                           customStyles={{ alignSelf: 'flex-start', margin: '3vh 0' }}
                           onClick={() => setIsModalOpened(true)}
                        />
                     </div>
                  </>
               )}
            </div>
         </div>

         {/* ---------------- Confirmation Modal ----------------- */}
         <Modal
            title="Confirmation"
            isOpen={isModalOpened}
            onClose={() => setIsModalOpened(false)}
            children={
               <>
                  <span> Are you sure you want to delete your account? </span>
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
                        onClick={handleRemoveAccount}
                     />
                  </div>
               </>
            }
         />
      </div>
   )
};

export default EditAccount;