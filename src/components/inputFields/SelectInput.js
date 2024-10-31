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
   const [highlightedIndex, setHighlightedIndex] = useState(-1);
   const [isOpen, setIsOpen] = useState(false);
   
   // Add "No selection" option at the beginning
   const updatedOptions = ["No selection", ...options];

   // Filtered options based on search term
   const filteredOptinos = searchTerm
      ? updatedOptions.filter(option => option.toLowerCase().startsWith(searchTerm.toLowerCase()))
      : updatedOptions;

   // ----------------- Handle selecting an option -----------------
   const handleOptionClick = (option, index) => {
      if (option === 'No selection') {
         setSelectedValue(''); // Reset selected value
         setHighlightedIndex(-1);
         onChange(''); // Pass empty value to the parent
      } else {
         setSelectedValue(option);
         setHighlightedIndex(index);
         onChange(option.toLowerCase()); // Pass the selected value to the parent via onChange
      }
      setSearchTerm('');
      setIsOpen(false);
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
            setHighlightedIndex(prevIndex => (prevIndex + 1) % filteredOptinos.length);

         } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prevIndex => (prevIndex - 1 + filteredOptinos.length) % filteredOptinos.length);

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
                        style={{color: index===0? 'var(--light-grey-color)' : 'var(--dark-grey-color)'}}
                        onClick={() => handleOptionClick(option, index)}
                        onMouseEnter={() => setHighlightedIndex(index)} // hover with mouse
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