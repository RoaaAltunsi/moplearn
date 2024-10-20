import { useState } from 'react';
import styles from './InputFields.module.css';

function CheckboxInput({
   label,
   handleChange
}) {

   const [isChecked, setIsChecked] = useState(false);

   // ---- Trigger the passed-in handler function with the checked state ----
   const handleCheckboxChange = (event) => {
      const checked = event.target.checked;
      setIsChecked(checked);
      handleChange(checked);
   }

   return (
      <label className={styles.custom_ckeckbox}>
         <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
         />
         <span className={styles.checkmark} />
         {label}
      </label>
   );
}

export default CheckboxInput;