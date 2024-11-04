import styles from './FindPartner.module.css';
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ExampleImage from '../../assets/images/course-img-test.png';
import CurvedLine from '../../components/curvedLine/CurvedLine';
import SelectInput from '../../components/inputFields/SelectInput';
import CheckboxInput from '../../components/inputFields/CheckboxInput';
import PartnerCard from '../../components/partnerCard/PartnerCard';
import Pagination from '../../components/pagination/Pagination';
import EmptyState from '../../components/emptyState/EmptyState';

const languages = [
   'English', 'Arabic', 'Chinese', 'Italian', 'French', 'Korean', 'Japanese', 'Russian', 'Turkish',
   'Spanish', 'German', 'Hindi', 'Portuguese', 'Swedish', 'Ukranian', 'Greek', 'Dutch', 'Tahi'
];

const partners = [
   {
      id: 1,
      name: 'Ola Saber',
      image: ExampleImage,
      specialization: 'Dentist',
      interests: ['Astronomy', 'Writing']
   },
   {
      id: 2,
      name: 'Rana Hafez',
      specialization: 'Programmer',
      interests: ['App Development', 'Web Development', 'Anime', 'Design']
   },
   {
      id: 3,
      name: 'Sabooh',
      interests: ['AI', 'Playing', 'Data Science', 'Design']
   },
   {
      id: 4,
      name: 'Doha Mohammed',
   },
   {
      id: 5,
      name: 'Rana Hafez',
      specialization: 'Programmer',
      interests: ['App Development', 'Web Development', 'Anime', 'Design']
   },
   {
      id: 6,
      name: 'Alzahraa Alaumri',
      interests: ['AI', 'Playing', 'Data Science', 'Design']
   },
]

function FindPartner() {

   const location = useLocation();
   const courseId = location.state?.id;
   const { courseTitle } = useParams();
   const [gender, setGender] = useState('');
   const [language, setLanguage] = useState('');
   const [partnerChecked, setPartnerChecked] = useState(false); // For partner list checkbox
   const [friendList, setFrientList] = useState([]); // LATER: Fetch user's friend list from DB
   const itemsPerPage = 9;
   const [currentItems, setCurrentItems] = useState(partners.slice(0, itemsPerPage));


   // ----------- Add/Remove user from partner list -----------
   const handlePartnerCheckboxChange = (value) => {
      setPartnerChecked(!partnerChecked);

      if (value) {
         console.log("POST user to partner list");
      } else {
         console.log("DELETE user from partner list");
      }
   };


   // ------------- Change content on page change --------------
   useEffect(() => {
      const getPageFromURL = () => {
         const searchParams = new URLSearchParams(location.search);
         const page = searchParams.get('page');
         return page ? parseInt(page, 10) : 1; // Return 1 as the default page
      };
      const handlePageClick = (startOffset) => {
         const newSlice = partners.slice(startOffset, startOffset + itemsPerPage);
         setCurrentItems(newSlice);
      };

      const page = getPageFromURL();
      const startOffset = (page - 1) * itemsPerPage;
      handlePageClick(startOffset);
   }, [location.search])


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

            {/* ----------- Resutls / Filters Header ---------- */}
            <div className={styles.header}>
               {/* Left sub-section */}
               <span className='small_font'> 5,370 results </span>

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
                     options={languages}
                     onChange={(value) => setLanguage(value)}
                  />
               </div>
            </div>

            {/* ---------- Partners Cards Container ----------- */}
            {partners.length > 0 ? (
               <>
                  <div className={styles.partners_grid}>
                     {currentItems.map(partner => (
                        <PartnerCard
                           key={partner.id}
                           id={partner.id}
                           name={partner.name}
                           image={partner.image}
                           specialization={partner.specialization}
                           interests={partner.interests}
                           isFriend={friendList.includes(partner.id)}
                        />
                     ))}
                  </div>

                  {/* Pagination section */}
                  {partners.length > itemsPerPage && (
                     <Pagination
                        itemsLength={partners.length}
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
   );
}

export default FindPartner;