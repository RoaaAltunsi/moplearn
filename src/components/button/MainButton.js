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
   onClick
}) {
   return (
      <button
         onClick={onClick}
         className={`
            ${isCircular ? styles.circular_btn : styles.rectangle_btn}
            ${isDestructive ? styles.x_btn : styles.btn}
         `}
         style={{ // Dynamic styles
            width: width,
            color: color,
            backgroundColor: backgroundColor
         }}
      >
         {
            isCircular
               ? <FontAwesomeIcon icon={iconName} />
               : label
         }
      </button>
   );
}

export default MainButton;