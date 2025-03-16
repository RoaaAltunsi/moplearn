import styles from './InputFields.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useRef, useEffect, useCallback } from 'react';

function SelectInput({
   label,
   value,
   options,
   isMultiOptions,
   onChange,
   error
}) {

   const selectRef = useRef(null);
   const listItemRefs = useRef([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedValue, setSelectedValue] = useState(value);
   const [selectedTags, setSelectedTags] = useState(value); // For multi-options
   const [highlightedIndex, setHighlightedIndex] = useState(-1);
   const [isOpen, setIsOpen] = useState(false);

   // Add "No selection" option at the beginning
   const updatedOptions = ["No selection", ...options];

   // Filtered options based on search term
   const filteredOptions = searchTerm
      ? options.filter(option => option.toLowerCase().startsWith(searchTerm.toLowerCase()))
      : updatedOptions;

   // ----------------- Handle selecting an option -----------------
   const handleOptionClick = useCallback((option, index) => {
      if (option === 'No selection') {
         setSelectedValue(''); // Reset selected value
         setHighlightedIndex(-1);
         onChange(isMultiOptions ? selectedTags : ''); // Pass empty value to the parent

      } else {
         setHighlightedIndex(index);
         if (isMultiOptions) {
            if (!selectedTags.includes(option)) { // Prevents option redundancy
               const updatedTags = [...selectedTags, option];
               setSelectedTags(updatedTags);
               onChange(updatedTags);
            }

         } else {
            setSelectedValue(option);
            onChange(option); // Pass the selected value to the parent via onChange
         }
      }
      setSearchTerm('');
      setIsOpen(false);
   }, [onChange, isMultiOptions, selectedTags]);

   // ------- Handle searching for a specific value in list ---------
   const handleOptionSearch = useCallback((value) => {
      setSearchTerm(value); // Update search term when typing
      setSelectedValue('');
      onChange(''); // Reset chosing value
      setIsOpen(true);
   }, [onChange]);

   // ---------- Handle removing a selected option (tag) ------------
   const handleRemoveTag = (option) => {
      const filteredTags = selectedTags.filter(tag => tag !== option);
      setSelectedTags(filteredTags);
      onChange(filteredTags);
   };

   // ----- Close dropdown when clicking outside the component ------
   const handleClickOutside = (e) => {
      if (selectRef && !selectRef.current.contains(e.target)) {
         setIsOpen(false);
      }
   };

   // ----- Ensures the highlighted dropdown option is visible ------
   const scrollToHighlighted = (index) => {
      const listItem = listItemRefs.current[index];
      if (listItem) {
         listItem.scrollIntoView({ block: 'nearest' });
      }
   };

   // ----------- Handle keyboard navigation and selection -----------
   const handleKeyDown = useCallback((e) => {
      if (isOpen) {
         if (e.key === 'ArrowDown') {
            e.preventDefault(); // Prevent page scroll down
            setHighlightedIndex(prevIndex => {
               const nextIndex = (prevIndex + 1) % filteredOptions.length;
               scrollToHighlighted(nextIndex);
               return nextIndex;
            });

         } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prevIndex => {
               const prevIndexAdjusted = (prevIndex - 1 + filteredOptions.length) % filteredOptions.length;
               scrollToHighlighted(prevIndexAdjusted);
               return prevIndexAdjusted;
            });

         } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            handleOptionClick(filteredOptions[highlightedIndex], highlightedIndex);

         } else if (e.key === 'Backspace' && selectedValue) {
            e.preventDefault();
            handleOptionSearch('');
         }
      }
   }, [filteredOptions, handleOptionClick, handleOptionSearch, highlightedIndex, isOpen, selectedValue]);


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
   }, [handleKeyDown]);


   return (
      <div className={styles.container} ref={selectRef}>
         <label
            className={`${(isMultiOptions? selectedTags?.length > 0 : value) ? styles.filled : ''} ${error? 'error' : ''}`}>
            {label}
         </label>

         {/* ----------------- Select input field ----------------- */}
         <div
            className={`
               ${styles.input_box}
               ${selectedValue || (Array.isArray(selectedTags) && selectedTags?.length > 0) || searchTerm ? styles.filled : ''}
               ${error? 'error' : ''}
            `}
         >
            {isMultiOptions ? (
               // Multioptions selection displayed as Tags
               <div className={styles.tags_container}>
                  {selectedTags.map((tag, index) => (
                     <span key={index} className={`small_font ${styles.tag}`}>
                        <FontAwesomeIcon
                           icon="fa-solid fa-xmark"
                           className={styles.close_icon}
                           onClick={() => handleRemoveTag(tag)}
                        />
                        {tag}
                     </span>
                  ))}

                  <div className={styles.multi_text_container}>
                     <input
                        type="text"
                        value={searchTerm}
                        className={styles.text_input}
                        onFocus={() => setIsOpen(true)}
                        onChange={(e) => handleOptionSearch(e.target.value)}
                     />
                  </div>
               </div>

            ) : (
               // Single selection displayed as Text
               <>
                  <input
                     type="text"
                     value={selectedValue || searchTerm}
                     placeholder="No selection"
                     className={styles.text_input}
                     onFocus={() => setIsOpen(true)}
                     onChange={(e) => handleOptionSearch(e.target.value)}
                  />
                  <FontAwesomeIcon
                     icon="chevron-down"
                     className={styles.box_icon}
                  />
               </>
            )}
         </div>

         {/* -------------------- Options List -------------------- */}
         {isOpen && (
            <ul className={styles.dropdown}>
               {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                     <li
                        key={index}
                        ref={(el) => listItemRefs.current[index] = el}
                        style={{ color: index === 0 ? 'var(--light-grey-color)' : 'var(--dark-grey-color)' }}
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

         {/* Display Error message if it exist */}
         {!!error && !isOpen && (
            <span className='error'> {error} </span>
         )}
      </div>
   );
}

export default SelectInput;