import styles from './UIStates.module.css';
import PulseLoader from "react-spinners/PulseLoader";

function LoadingState({ message = "Loading..." }) {
   return (
      <div className={styles.loading}>
         <PulseLoader
            color="var(--white-color)"
            loading={true}
            size={25}
            aria-label="Loading Spinner"
            data-testid="loader"
         />
         <h3> {message} </h3>
      </div>
   )
}

export default LoadingState;