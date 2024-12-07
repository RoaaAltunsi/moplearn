import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Apply Bounce-In on Load animation to all pages
const PageWrapper = ({ children }) => {
   const location = useLocation();

   return (
      <motion.div
         key={location.pathname} // This ensures the animation triggers on every route change
         initial={{ y: 50, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ type: 'spring', stiffness: 50 }}
      >
         {children}
      </motion.div>
   )
};

export default PageWrapper;