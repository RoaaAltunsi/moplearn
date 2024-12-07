import styles from './Pagination.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactPaginate from 'react-paginate';
import { useLocation, useNavigate } from 'react-router-dom';

function Pagination({
   itemsLength,
   itemsPerPage,
}) {

   const location = useLocation();
   const navigate = useNavigate();
   const pageCount = Math.ceil(itemsLength / itemsPerPage);

   // Helper function to extract the current page number from the URL
   const getCurrentPageFromURL = () => {
      const searchParams = new URLSearchParams(location.search);
      const page = searchParams.get('page');
      return page? parseInt(page, 10) - 1 : 0; // Convert to zero-based index for ReactPaginate
   }

   const updateURLWithPage = (e) => {
      const pageNumber = e.selected + 1; // React Paginate uses zero-based index, so need to add 1
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page', pageNumber);
      navigate(`${location.pathname}?${searchParams.toString()}`);
   }


   return (
      <div>
         <ReactPaginate
            pageCount={pageCount}
            nextLabel={
               <FontAwesomeIcon icon="fa-solid fa-angle-right" />
            }
            previousLabel={
               <FontAwesomeIcon icon="fa-solid fa-angle-left" />
            }
            breakLabel="..."
            pageRangeDisplayed={3} // Number of pages at the middle
            marginPagesDisplayed={1} // Number of pages at the beginning and end
            onPageChange={updateURLWithPage}
            forcePage={getCurrentPageFromURL()} // Explicitly set the active page
            containerClassName={styles.container}
            pageClassName={styles.page_item}
            activeClassName={styles.active}
            breakLinkClassName={styles.break_label}
            disabledClassName={styles.disabled_btn}
            previousClassName={styles.prev}
            nextClassName={styles.next}
         />
      </div>
   );
}

export default Pagination;