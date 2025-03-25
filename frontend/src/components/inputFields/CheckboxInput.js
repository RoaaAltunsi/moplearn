import styles from './InputFields.module.css';

function CheckboxInput({
   label,
   isChecked,
   onChange
}) {

   return (
      <label className={`${styles.custom_ckeckbox} small_font`}>
         <input
            type="checkbox"
            checked={isChecked ?? false} // Receive checked value from the parent
            onChange={(e) => onChange(e.target.checked)}
         />
         <span className={styles.checkmark} />
         {label}
      </label>
   );
}

export default CheckboxInput;