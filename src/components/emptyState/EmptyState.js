import styles from './EmptyState.module.css';
import { ReactComponent as NoResults } from '../../assets/images/no-results.svg';

function EmptyState() {
   return (
      <div className={styles.container}>
         <NoResults className={styles.image} />
         <h3> No results Found </h3>
      </div>
   );
}

export default EmptyState;