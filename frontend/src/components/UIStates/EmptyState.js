import styles from './UIStates.module.css';
import NoContent from '../../assets/images/no-content.png';

function EmptyState() {
   return (
      <div className={styles.container}>
         <img src={NoContent} alt="no results" loading='lazy' />
         <h3> No results Found </h3>
      </div>
   );
}

export default EmptyState;