import styles from './CurvedLine.module.css';
import { useEffect, useRef } from 'react';

function CurvedLine({
   amplitude = 20,
   speed = 5
}) {

   const pathRef = useRef(null);

   // Function to generate a sine wave path
   const generateSineWave = (start, amplitude, frequency, length) => {
      let d = `M0 ${amplitude * Math.sin(frequency * start) + 26}`; // Starting point of the sine wave
      for (let i = 1; i <= length; i += 10) {
         const y = amplitude * Math.sin(frequency * (i + start)) + 26; // Generate the y-values of the wave
         d += ` L${i} ${y}`; // Add each line segment to the path
      }
      return d; // Return the complete path
   };

   useEffect(() => {
      let start = 0;
      const frequency = 2 * Math.PI / 1440; // Make one full sine wave fit the entire length of the SVG (1440 units wide)

      // Function to animate the path
      const animatePath = () => {
         const path = pathRef.current;
         if (path) {
            const newPath = generateSineWave(start, amplitude, frequency, 1440);
            path.setAttribute('d', newPath);
            start += speed; // Speed of wave animation
         }
         requestAnimationFrame(animatePath); // Keep animating
      }

      animatePath();
   }, [amplitude, speed]);

   return (
      <svg className={styles.curve_line} viewBox="0 0 1440 52" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path ref={pathRef} d="M0 26" stroke="var(--grey-background-color)" />
      </svg>
   );
}

export default CurvedLine;