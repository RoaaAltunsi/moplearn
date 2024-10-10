import styles from './InputFields.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useRef, useEffect } from 'react';

function SelectInput({
   label,
   value,
   options,
   onChange
}) {

   const selectRef = useRef(null);
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedValue, setSelectedValue] = useState('');
   const [highlightedIndex, sethigHlightedIndex] = useState(-1);
   const [isOpen, setIsOpen] = useState(false);

   // Filtered options based on search term
   const filteredOptinos = searchTerm
      ? options.filter(option => option.toLowerCase().startsWith(searchTerm.toLowerCase()))
      : options;

   // ----------------- Handle selecting an option -----------------
   const handleOptionClick = (option, index) => {
      setSelectedValue(option);
      setSearchTerm('');
      sethigHlightedIndex(index);
      setIsOpen(false);
      onChange(option.toLowerCase()); // Pass the selected value to the parent via onChange
   };
   // ------- Handle searching for a specific value in list ---------
   const handleOptionSearch = (value) => {
      setSearchTerm(value); // Update search term when typing
      setSelectedValue('');
      onChange(''); // Reset chosing value
      setIsOpen(true);
   }
   // ----- Close dropdown when clicking outside the component ------
   const handleClickOutside = (e) => {
      if (selectRef && !selectRef.current.contains(e.target)) {
         setIsOpen(false);
      }
   }
   // ----------- Handle keyboard navigation and selection -----------
   const handleKeyDown = (e) => {
      if (isOpen) {
         if (e.key === 'ArrowDown') {
            e.preventDefault(); // Prevent page scroll down
            sethigHlightedIndex(prevIndex => (prevIndex + 1) % filteredOptinos.length);

         } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            sethigHlightedIndex(prevIndex => (prevIndex - 1 + filteredOptinos.length) % filteredOptinos.length);

         } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            handleOptionClick(filteredOptinos[highlightedIndex], highlightedIndex);

         } else if (e.key === 'Backspace' && selectedValue) {
            e.preventDefault();
            handleOptionSearch('');
         }
      }
   }

   // ------------- Add event listener for outside clicks -------------
   useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      }
   }, []);
   // ----------- Add event listener for keyboard navigation ----------
   useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
         document.removeEventListener('keydown', handleKeyDown);
      }
   })

   return (
      <div className={styles.container} ref={selectRef}>
         <label
            className={`
            ${value ? styles.filled : ''}
            ${isOpen ? styles.open_dropdown : ''}
         `}>
            {label}
         </label>

         {/* Select input field */}
         <div
            className={`
               ${styles.input_box}
               ${selectedValue || searchTerm ? styles.filled : ''}
               ${isOpen ? styles.open_dropdown : ''}
            `}
            onClick={() => setIsOpen(!isOpen)}
         >
            <input
               type="text"
               value={selectedValue || searchTerm}
               placeholder="No selection"
               className={styles.text_input}
               readOnly={options.length <= 5}
               onChange={(e) => handleOptionSearch(e.target.value)}
            />
            <FontAwesomeIcon
               icon="chevron-down"
               className={styles.box_icon}
            />
         </div>

         {/* Options list */}
         {isOpen && (
            <ul className={styles.dropdown}>
               {filteredOptinos.length > 0 ? (
                  filteredOptinos.map((option, index) => (
                     <li
                        key={index}
                        onClick={() => handleOptionClick(option, index)}
                        onMouseEnter={() => sethigHlightedIndex(index)} // hover with mouse
                        className={highlightedIndex === index ? styles.highlighted : ''}
                     >
                        {option}
                     </li>
                  ))
               ) : (
                  <li> No options found </li>
               )}

            </ul>
         )}
      </div>
   );
}

export default SelectInput;