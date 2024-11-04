import styles from './EmptyState.module.css';
import NoContent from '../../assets/images/no-content.png';

function EmptyState() {
   return (
      <div className={styles.container}>
         <img src={NoContent} alt="no results" />
         <h3> No results Found </h3>
      </div>
   );
}

export default EmptyState;