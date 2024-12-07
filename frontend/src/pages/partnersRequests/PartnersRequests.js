import styles from './PartnersRequests.module.css';
import Tabs from '../../components/tabs/Tabs';
import MainButton from '../../components/button/MainButton';
import Modal from '../../components/modal/Modal';
import EmptyState from '../../components/emptyState/EmptyState';
import DefaultImg from '../../assets/images/default-profile.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';


const receivedRequests = [
   { full_name: 'Rana Hafez', username: 'ran87', specialization: 'Programmer' },
   { full_name: 'Doha Mohammed', username: 'dohamm', specialization: 'Writer' },
];

const sentRequests = [
   { full_name: 'Rana Hafez', username: 'ran87', specialization: 'Programmer' },
   { full_name: 'Doha Mohammed', username: 'dohamm', specialization: 'Writer' }
];


function PartnersRequests() {

   const navigate = useNavigate();
   const tabs = ['Received', 'Sent'];
   const [searchParams] = useSearchParams();
   const activeTabFromURL = searchParams.get('tab') || 'received';
   const [activeTab, setActiveTab] = useState(activeTabFromURL);
   const [isModalOpened, setIsModalOpened] = useState(false);
   const [modalAction, setModalAction] = useState(null);


   // -------------- Control Opening Confirmation Modal -------------
   const openModal = (actionType) => {
      setModalAction(actionType);
      setIsModalOpened(true);
   };

   const handleAcceptRequest = () => {
      // Backend logic to add new partner in user's partner list
   };

   const handleRemoveReceivedReq = () => {
      // Backend logic to ignore the received partnership request
   };

   const handleRemoveSentReq = () => {
      // Backend logic to cancel the sent partnership request
   };

   // --------- Conditional render for modal confirm action ---------
   const modalConfirmAction = modalAction === 'removeReceivedReq' ? handleRemoveReceivedReq : handleRemoveSentReq;


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


   return (
      <div className='container'>
         <div className={styles.content_wrap}>
            <h2> Partnership Requests </h2>

            {/* ---------------- Tabs Switch ----------------- */}
            <Tabs
               tabs={tabs}
               activeTab={activeTab}
               onTabChange={setActiveTab}
            />

            <div className={styles.info_container}>
               {activeTab === 'received' ? (
                  // ---------------- Received Requests -----------------
                  (!receivedRequests || receivedRequests.length === 0) ? (
                     <EmptyState />
                  ) : (
                     <>
                        {receivedRequests.map((partner, index) => (
                           <div key={index} className={styles.section}>
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
                                    label="Accept"
                                    customStyles={{ minWidth: 'auto' }}
                                    onClick={handleAcceptRequest}
                                 />
                                 <FontAwesomeIcon
                                    icon="fa-solid fa-xmark"
                                    className={styles.remove_icon}
                                    onClick={() => openModal('removeReceivedReq')}
                                 />
                              </div>
                           </div>
                        ))}
                     </>
                  )

               ) : (
                  // ------------------ Sent Requests --------------------
                  (!sentRequests || sentRequests.length === 0) ? (
                     <EmptyState />
                  ) : (
                     <>
                        {sentRequests.map((partner, index) => (
                           <div key={index} className={styles.section}>
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
                                 <FontAwesomeIcon
                                    icon="fa-solid fa-xmark"
                                    className={styles.remove_icon}
                                    onClick={() => openModal('removeSentReq')}
                                 />
                              </div>
                           </div>
                        ))}
                     </>
                  )
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
                  <span>
                     Are you sure you want to
                     {modalAction === 'removeReceivedReq' ? ' ignore ' : ' cancel '}
                     this partnership request?
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
      </div >
   )
};

export default PartnersRequests;