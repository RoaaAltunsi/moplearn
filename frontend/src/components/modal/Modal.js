import styles from './Modal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Modal({
   isOpen,
   onClose,
   title,
   children
}) {

   if (!isOpen) return null;
   return (
      <div className={styles.overlay} onClick={onClose}>

         <div className={styles.modal_content}>
            {/* Close Icon */}
            <FontAwesomeIcon
               icon="fa-solid fa-xmark"
               className={styles.close_icon}
               onClick={onClose}
            />

            {/* Modal Content */}
            <h3> {title} </h3>
            <div>
               {children}
            </div>
         </div>

      </div>
   )
};

export default Modal;