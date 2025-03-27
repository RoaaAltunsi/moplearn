import styles from './EditAccount.module.css';
import Tabs from '../../components/tabs/Tabs';
import DefaultImg from '../../assets/images/default-profile.png';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MainButton from '../../components/button/MainButton';
import TextInput from '../../components/inputFields/TextInput';
import SelectInput from '../../components/inputFields/SelectInput';
import Modal from '../../components/modal/Modal';
import useFormFields from '../../hooks/useFormFields';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import countryList from "react-select-country-list";
import { getAllTopics } from '../../redux/slices/topicSlice';
import { toast } from 'react-toastify';
import { deleteAccount, updateAccount } from "../../redux/slices/userSlice";
import { updateProfile } from '../../redux/slices/userProfileSlice';


function EditAccount() {

   const navigate = useNavigate();
   const dispatch = useDispatch();
   const location = useLocation();
   const imageInputRef = useRef(null);
   const editBtnRef = useRef(null);
   const profileImgDropMenuRef = useRef(null);
   const tabs = ['Profile Info', 'Settings'];
   const locations = useMemo(() => countryList().getData(), []);
   const [searchParams] = useSearchParams();
   const activeTabFromURL = searchParams.get('tab') || 'profile-info';
   const [activeTab, setActiveTab] = useState(activeTabFromURL);
   const [isDropMenuOpened, setIsDropMenuOpened] = useState(false); // Edit profile img drop menu
   const [isModalOpened, setIsModalOpened] = useState(false);
   const { user, isAuthenticated } = useSelector((state) => state.auth);
   const { languages } = useSelector((state) => state.language);
   const { topics } = useSelector((state) => state.topic);
   const { validationErrors } = useSelector((state) => state.user);
   const initialValues = {
      profile_img: user?.image,
      first_name: user?.full_name?.split(' ')[0] || '',
      last_name: user?.full_name?.split(' ')[1] || '',
      specialization: user?.specialization || '',
      image: user?.image || null,
      location: user?.location || '',
      bio: user?.bio || '',
      languages: user?.languages?.map(lang => lang.language) || [],
      interests: user?.interests?.map(topic => topic.title) || [],
      username: user?.username || '',
      email: user?.email || '',
      password: ''
   };
   const { fields, handleChange } = useFormFields(initialValues);
   const [modifiedFields, setModifiedFields] = useState({}); // track only the updated fields


   // ------- Handle clicking Upload Photo in edit profile img --------
   const handleUploadClick = () => {
      imageInputRef.current.click();
      setIsDropMenuOpened(false);
   };

   // --------------- Handle uploading new Profile Image --------------
   const handleUploadImage = (e) => {
      const file = e.target.files[0];
      if (file) {
         handleChange('image', file);
         setModifiedFields(prev => ({
            ...prev,
            image: file
         }));
      }
   };

   // ---------------- Track updates in profile fields ----------------
   const trackFieldsChange = (field, value) => {
      handleChange(field, value);

      setModifiedFields(prev => {
         const updatedFields = { ...prev, [field]: value };
         if (field === 'first_name' || field === 'last_name') {
            updatedFields.full_name = `${fields.first_name} ${fields.last_name}`.trim();
         }

         return updatedFields;
      });
   };

   // ------------------- Handle Remove Profile Image -----------------
   const handleRemoveProfileImg = () => {
      setIsDropMenuOpened(false);
      handleChange('image', null);
      setModifiedFields(prev => ({
         ...prev,
         remove_image: 1,
      }));
   };

   // ------------------- Handle Update Profile Info ------------------
   const handleUpdateProfile = async () => {
      if (Object.keys(modifiedFields).length === 0) {
         toast.error("No changes detected");
         return;
      }

      const formData = new FormData();

      // Append modified text fields
      Object.keys(modifiedFields).forEach((key) => {
         if (key === "image" && modifiedFields.image instanceof File) {
            formData.append("image", modifiedFields.image);
         } else if (Array.isArray(modifiedFields[key])) {
            formData.append(key, modifiedFields[key].join(","));
         } else {
            formData.append(key, modifiedFields[key]);
         }
      });

      // Convert languages & interests to IDs before sending
      if (modifiedFields.languages) {
         const languageIds = fields.languages
            .map((lang) => languages.find((l) => l.language === lang)?.id)
            .filter((id) => id !== undefined);
         formData.append("languages", languageIds.join(","));
      }

      if (modifiedFields.interests) {
         const interestIds = fields.interests
            .map((topic) => topics.find((t) => t.title === topic)?.id)
            .filter((id) => id !== undefined);
         formData.append("interests", interestIds.join(","));
      }

      // Dispatch profile update
      try {
         await dispatch(updateProfile(formData)).unwrap();
         toast.success("Your info has been updated successfully!");
      } catch (err) {
         toast.error(err.error);
      }
   };

   // ------------------- Handle Update Account Info ------------------
   const handleUpdateAccount = async () => {
      if (Object.keys(modifiedFields).length === 0) {
         toast.error("No changes detected");
         return;
      }

      // Dispatch account update
      try {
         await dispatch(updateAccount(modifiedFields)).unwrap();
         toast.success("Your info has been updated successfully!");
      } catch (err) {
         toast.error(err.error);
      }
   };

   // ------------------- Handle Remove user account ------------------
   const handleRemoveAccount = async () => {
      try {
         await dispatch(deleteAccount(fields['password'])).unwrap();
         setIsModalOpened(false);
         toast.success("Your account has beed deleted successfully");
         setTimeout(() => {
            window.location.href = "/";
         }, 2000);
      } catch (err) {
         toast.error(err.error);
      }
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

      toast.dismiss(); // Close all toasts when changing tabs

      setModifiedFields({}); // reset modification on tab change
   }, [activeTab, navigate, searchParams]);

   // ----------- Handle clicking outside the opened menu -----------
   useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [handleClickOutside]);

   // ------------------ Fetch topics on page load ------------------
   useEffect(() => {
      if (topics?.length === 0 && isAuthenticated) {
         dispatch(getAllTopics());
      }
   }, [dispatch, topics?.length, isAuthenticated]);


   return (
      <div className='container'>
         <div className={styles.content_wrap}>
            {isAuthenticated ? (
               <>
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
                                 <img
                                    src={fields['image'] instanceof File ? URL.createObjectURL(fields['image']) : fields['image'] || DefaultImg}
                                    alt="Profile"
                                    loading='lazy'
                                 />
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

                                    {fields['image'] && (
                                       <li onClick={handleRemoveProfileImg}>
                                          <FontAwesomeIcon icon="fa-regular fa-trash-can" />
                                          <span className='small_font'> Remove </span>
                                       </li>
                                    )}
                                 </ul>
                              </div>

                              {validationErrors['image'] && (
                                 <span className='error' style={{ alignSelf: 'center' }}> {validationErrors['image'][0]} </span>
                              )}
                           </div>

                           {/* -------- Profile Info Input Fields -------- */}
                           <div className={styles.section}>
                              <h4> Personal Information </h4>
                              <div className={styles.flex_row}>
                                 <TextInput
                                    label="First Name"
                                    value={fields['first_name']}
                                    error={validationErrors['first_name'] ? validationErrors['first_name'][0] : ""}
                                    onChange={trackFieldsChange}
                                 />
                                 <TextInput
                                    label="Last Name"
                                    value={fields['last_name']}
                                    error={validationErrors['last_name'] ? validationErrors['last_name'][0] : ""}
                                    onChange={(value) => trackFieldsChange('last_name', value)}
                                 />
                              </div>

                              <div className={styles.flex_row}>
                                 <TextInput
                                    label="Specialization"
                                    value={fields['specialization']}
                                    error={validationErrors['specialization'] ? validationErrors['specialization'][0] : ""}
                                    onChange={(value) => trackFieldsChange('specialization', value)}
                                 />
                                 <SelectInput
                                    label="Location"
                                    value={fields['location']}
                                    options={locations.map(location => location.label)}
                                    error={validationErrors['location'] ? validationErrors['location'][0] : ""}
                                    onChange={(value) => trackFieldsChange('location', value)}
                                 />
                              </div>

                              <div className={styles.flex_row}>
                                 <TextInput
                                    isMulitLine={true}
                                    label="Bio"
                                    value={fields['bio']}
                                    error={validationErrors['bio'] ? validationErrors['bio'][0] : ""}
                                    onChange={(value) => trackFieldsChange('bio', value)}
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
                                    options={languages.map(lang => lang.language)}
                                    onChange={(value) => trackFieldsChange('languages', value)}
                                 />
                              </div>

                              <div>
                                 <SelectInput
                                    isMultiOptions={true}
                                    label="Interests"
                                    value={fields['interests']}
                                    options={topics.map(topic => topic.title)}
                                    onChange={(value) => trackFieldsChange('interests', value)}
                                 />
                              </div>
                           </div>

                           <div className={styles.section}>
                              <MainButton
                                 label="Save Changes"
                                 onClick={handleUpdateProfile}
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
                                    error={validationErrors['username'] ? validationErrors['username'][0] : ""}
                                    onChange={(value) => trackFieldsChange('username', value)}
                                 />
                                 <TextInput
                                    label="Email"
                                    value={fields['email']}
                                    error={validationErrors['email'] ? validationErrors['email'][0] : ""}
                                    onChange={(value) => trackFieldsChange('email', value)}
                                 />
                              </div>

                              <MainButton
                                 label="Save Changes"
                                 onClick={handleUpdateAccount}
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
               </>
            ) : (
               // ----------- Ask user to login -----------
               <div className={'login_ask_container'}>
                  <FontAwesomeIcon icon="fa-solid fa-circle-exclamation" className={'icon'} />
                  <p>Please log in to continue</p>
                  <MainButton
                     label="Log in"
                     onClick={() => navigate('/login', { state: { from: location.pathname } })}
                  />
               </div>
            )}
         </div>

         {/* ---------------- Confirmation Modal ----------------- */}
         <Modal
            title="Confirmation"
            isOpen={isModalOpened}
            onClose={() => setIsModalOpened(false)}
            children={
               <>
                  <span> Enter your password to confirm deleting your account </span>
                  <TextInput
                     isPassword={true}
                     value={fields['password']}
                     onChange={(value) => handleChange('password', value)}
                  />
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