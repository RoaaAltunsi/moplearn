import styles from './FindPartner.module.css';
import { useState, useEffect } from 'react';
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
import { getUsers } from '../../redux/slices/userSlice';
import { toast } from 'react-toastify';


// const partners = [
//    {
//       id: 1,
//       name: 'Ola Saber',
//       image: ExampleImage,
//       specialization: 'Dentist',
//       interests: ['Astronomy', 'Writing']
//    },
//    {
//       id: 2,
//       name: 'Rana Hafez',
//       specialization: 'Programmer',
//       interests: ['App Development', 'Web Development', 'Anime', 'Design']
//    },
//    {
//       id: 3,
//       name: 'Sabooh',
//       interests: ['AI', 'Playing', 'Data Science', 'Design']
//    },
//    {
//       id: 4,
//       name: 'Doha Mohammed',
//    },
//    {
//       id: 5,
//       name: 'Rana Hafez',
//       specialization: 'Programmer',
//       interests: ['App Development', 'Web Development', 'Anime', 'Design']
//    },
//    {
//       id: 6,
//       name: 'Alzahraa Alaumri',
//       interests: ['AI', 'Playing', 'Data Science', 'Design']
//    },
// ]

function FindPartner() {

   const location = useLocation();
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const courseId = location.state?.id;
   const { isAuthenticated } = useSelector((state) => state.auth);
   const { users } = useSelector((state) => state.user);
   const { languages } = useSelector((state) => state.language);
   const { courseTitle } = useParams();
   const [gender, setGender] = useState('');
   const [language, setLanguage] = useState('');
   const [partnerChecked, setPartnerChecked] = useState(false); // For partner list checkbox
   const [friendList, setFriendList] = useState([]); // LATER: Fetch user's friend list from DB
   const itemsPerPage = 9;
   const [currentItems, setCurrentItems] = useState([]);


   // ----------- Add/Remove user from partner list -----------
   const handlePartnerCheckboxChange = (value) => {
      setPartnerChecked(!partnerChecked);

      if (value) {
         console.log("POST user to partner list");
      } else {
         console.log("DELETE user from partner list");
      }
   };


   // -------------- Fetch partnets on page load --------------
   useEffect(() => {
      try {
         if (users.length === 0) {
            dispatch(getUsers()).unwrap();
         }
         setCurrentItems(users.slice(0, itemsPerPage));
      } catch (err) {
         toast.error(err?.error);
      }
   }, [dispatch, users]);


   // ------------- Change content on page change --------------
   useEffect(() => {
      const getPageFromURL = () => {
         const searchParams = new URLSearchParams(location.search);
         const page = searchParams.get('page');
         return page ? parseInt(page, 10) : 1; // Return 1 as the default page
      };
      const handlePageClick = (startOffset) => {
         const newSlice = users.slice(startOffset, startOffset + itemsPerPage);
         setCurrentItems(newSlice);
      };

      const page = getPageFromURL();
      const startOffset = (page - 1) * itemsPerPage;
      handlePageClick(startOffset);
   }, [location.search, users])


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
                     <span className='small_font'> {users.length} results </span>

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
                           label="Gender"
                           value={gender}
                           options={['Male', 'Female']}
                           onChange={(value) => setGender(value)}
                        />
                        <SelectInput
                           label="Language"
                           value={language}
                           options={languages.map(language => language.language)}
                           onChange={(value) => setLanguage(value)}
                        />
                     </div>
                  </div>

                  {/* ---------- Partners Cards Container ----------- */}
                  {users.length > 0 ? (
                     <>
                        <div className={styles.partners_grid}>
                           {currentItems.map(partner => (
                              <PartnerCard
                                 key={partner.id}
                                 id={partner.id}
                                 name={partner.full_name ?? partner.username}
                                 image={partner.image}
                                 specialization={partner.specialization}
                                 interests={partner.interests}
                                 isFriend={friendList.includes(partner.id)}
                              />
                           ))}
                        </div>

                        {/* Pagination section */}
                        {users.length > itemsPerPage && (
                           <Pagination
                              itemsLength={users.length}
                              itemsPerPage={itemsPerPage}
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
               <div className={styles.login_container}>
                  <FontAwesomeIcon icon="fa-solid fa-users" className={styles.icon} />
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