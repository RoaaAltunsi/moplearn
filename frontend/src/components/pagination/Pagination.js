import styles from './Pagination.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactPaginate from 'react-paginate';
import { useLocation, useNavigate } from 'react-router-dom';

function Pagination({
   currentPage,
   lastPage,
   onPageChange,
}) {

   const location = useLocation();
   const navigate = useNavigate();

   const handlePageChange = (e) => {
      const pageNumber = e.selected + 1; // React Paginate uses zero-based index, so need to add 1
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page', pageNumber);
      navigate(`${location.pathname}?${searchParams.toString()}`);

      onPageChange(pageNumber);
   }


   return (
      <div>
         <ReactPaginate
            pageCount={lastPage}
            nextLabel={
               <FontAwesomeIcon icon="fa-solid fa-angle-right" />
            }
            previousLabel={
               <FontAwesomeIcon icon="fa-solid fa-angle-left" />
            }
            breakLabel="..."
            pageRangeDisplayed={3} // Number of pages at the middle
            marginPagesDisplayed={1} // Number of pages at the beginning and end
            onPageChange={handlePageChange}
            forcePage={currentPage - 1} // Explicitly set the active page
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