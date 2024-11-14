import { useState } from 'react';
import styles from './InputFields.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function TextInput({
   label,
   value,
   placeholder,
   icon,
   isPassword,
   isMulitLine,
   onChange
}) {

   const [securePass, setSecurePass] = useState(true);
   const toggleSecurePassword = () => {
      setSecurePass(!securePass);
   }

   return (
      <div className={styles.container}>
         <label className={`${value ? styles.filled : ''}`}> {label} </label>

         <div className={`${styles.input_box} ${value ? styles.filled : ''}`}>
            {isMulitLine ? (
               // Multilines text field
               <textarea
                  value={value}
                  type='text'
                  onChange={(e) => onChange(e.target.value)}
                  className={styles.text_input}
               />
            ) : (
               // Single text field
               <>
                  {icon && (
                     <FontAwesomeIcon
                        icon={icon}
                        className={styles.box_icon}
                        style={{ paddingRight: '0.5vw' }}
                     />
                  )}
                  <input
                     value={value}
                     placeholder={placeholder}
                     type={(isPassword && securePass) ? 'password' : 'text'}
                     onChange={(e) => onChange(e.target.value)}
                     className={styles.text_input}
                  />
               </>
            )}

            {/* Display eye icon for password */}
            {isPassword && (
               <FontAwesomeIcon
                  icon={securePass ? 'eye-slash' : 'eye'}
                  style={{
                     color: securePass ? 'var(--light-grey-color)' : 'var(--secondary-color)'
                  }}
                  onClick={(e) => {
                     e.preventDefault();
                     toggleSecurePassword();
                  }}
                  className={styles.box_icon}
               />
            )}
         </div>

      </div>
   );
}

export default TextInput;