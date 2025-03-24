import styles from './PartnersRequests.module.css';
import Tabs from '../../components/tabs/Tabs';
import MainButton from '../../components/button/MainButton';
import Modal from '../../components/modal/Modal';
import EmptyState from '../../components/UIStates/EmptyState';
import DefaultImg from '../../assets/images/default-profile.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../../components/pagination/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFriendship, getReceivedRequests, getSentRequests, updateStatus } from '../../redux/slices/friendshipSlice';
import { toast } from 'react-toastify';


function PartnersRequests() {

   const dispatch = useDispatch();
   const location = useLocation();
   const navigate = useNavigate();
   const tabs = ['Received', 'Sent'];
   const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
   const activeTabFromURL = searchParams.get('tab') || 'received';
   const [activeTab, setActiveTab] = useState(activeTabFromURL);
   const [isModalOpened, setIsModalOpened] = useState(false);
   const [selectedPartner, setSelectedPartner] = useState(null);
   const { receivedRequests, receivedPagination, sentRequests, sentPagination } = useSelector((state) => state.friendship);


   // -------------- Control Opening Confirmation Modal -------------
   const openModal = (friendshipId) => {
      setSelectedPartner(friendshipId);
      setIsModalOpened(true);
   };

   // -------------- Handle accept friendship request ---------------
   const handleAcceptRequest = async (friendshipId) => {
      try {
         await dispatch(updateStatus({ id: friendshipId, newStatus: 'accepted' })).unwrap();
         toast.success("The request is successfully accepted!");
      } catch (err) {
         toast.error(err.error);
      }
   };

   // -------------- Handle delete friendship request ---------------
   const handleDeleteRequest = async () => {
      try {
         await dispatch(deleteFriendship({ id: selectedPartner, status: 'pending' })).unwrap();
         setIsModalOpened(false);
         toast.success("The request is successfully deleted!");
      } catch (err) {
         toast.error(err.error);
      }
   };

   // --------------- Update URL on page change ----------------
   const handlePageChange = (newPage) => {
      searchParams.set("page", newPage);
      navigate(`${location.pathname}?${searchParams.toString()}`);
   };


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

   // ------------------ Fetch received requests -------------------
   useEffect(() => {
      if (receivedRequests.length === 0) {
         dispatch(getReceivedRequests());
      }
   }, [dispatch, receivedRequests.length]);

   // -------------------- Fetch sent requests ---------------------
   useEffect(() => {
      if (sentRequests.length === 0) {
         dispatch(getSentRequests());
      }
   }, [dispatch, sentRequests.length]);


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
                  (receivedRequests?.length === 0) ? (
                     <EmptyState />
                  ) : (
                     <>
                        {receivedRequests.map((request) => (
                           <div key={request.id} className={styles.section}>
                              <div className={styles.left_subsection}>
                                 <div
                                    className={styles.partnet_img}
                                    onClick={() => navigate(`/profile/${request.user?.username}`)}
                                 >
                                    <img src={request.user?.image ? request.user?.image : DefaultImg} alt="" loading='lazy' />
                                 </div>
                                 <div>
                                    <h4> {request.user?.full_name ? request.user?.full_name : request.user?.username} </h4>
                                    <span className='small_font'> {request.user?.specialization} </span>
                                 </div>
                              </div>

                              <div className={styles.right_subsection}>
                                 <MainButton
                                    label="Accept"
                                    customStyles={{ minWidth: 'auto' }}
                                    onClick={() => handleAcceptRequest(request.id)}
                                 />
                                 <FontAwesomeIcon
                                    icon="fa-solid fa-xmark"
                                    className={styles.remove_icon}
                                    onClick={() => openModal(request.id)}
                                 />
                              </div>
                           </div>
                        ))}
                     </>
                  )

               ) : (
                  // ------------------ Sent Requests --------------------
                  (sentRequests?.length === 0) ? (
                     <EmptyState />
                  ) : (
                     <>
                        {sentRequests.map((request) => (
                           <div key={request.id} className={styles.section}>
                              <div className={styles.left_subsection}>
                                 <div
                                    className={styles.partnet_img}
                                    onClick={() => navigate(`/profile/${request.user?.username}`)}
                                 >
                                    <img src={request.user?.profileImg ? request.user?.profileImg : DefaultImg} alt="" loading='lazy' />
                                 </div>
                                 <div>
                                    <h4> {request.user?.full_name ? request.user?.full_name : request.user?.username} </h4>
                                    <span className='small_font'> {request.user?.specialization} </span>
                                 </div>
                              </div>

                              <div className={styles.right_subsection}>
                                 <FontAwesomeIcon
                                    icon="fa-solid fa-xmark"
                                    className={styles.remove_icon}
                                    onClick={() => openModal(request.id)}
                                 />
                              </div>
                           </div>
                        ))}
                     </>
                  )
               )}
            </div>

            {/* Pagination section */}
            {(activeTab === 'received' && receivedPagination?.total > receivedPagination?.per_page) && (
               <Pagination
                  currentPage={receivedPagination.current_page}
                  lastPage={sentPagination?.last_page}
                  onPageChange={handlePageChange}
               />
            )}
            {(activeTab === 'sent' && sentPagination?.total > sentPagination?.per_page) && (
               <Pagination
                  currentPage={sentPagination?.current_page}
                  lastPage={sentPagination?.last_page}
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
                  <span>
                     Are you sure you want to delete this partnership request?
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
                        onClick={handleDeleteRequest}
                     />
                  </div>
               </>
            }
         />
      </div >
   )
};

export default PartnersRequests;