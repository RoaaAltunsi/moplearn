import styles from './MainButton.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function MainButton({
   isCircular,
   isDestructive,
   label,
   iconName,
   width,
   color,
   backgroundColor,
   onClick,
   tooltip, // Descriptive msg on hover
   borderStyles,
}) {
   return (
      <button
         onClick={onClick}
         title={tooltip}
         className={`
            ${isCircular ? styles.circular_btn : styles.rectangle_btn}
            ${isDestructive ? styles.x_btn : styles.btn}
         `}
         style={{ // Dynamic styles
            width: width,
            color: color,
            backgroundColor: backgroundColor,
            border: borderStyles
         }}
      >
         {
            isCircular
               ? <FontAwesomeIcon icon={iconName} className={styles.icon} />
               : label
         }
      </button>
   );
}

export default MainButton;