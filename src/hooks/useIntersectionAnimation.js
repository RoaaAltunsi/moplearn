import { useEffect } from 'react';

// Handle animations based on the Intersection Observer API
// It is designed to animate SVG paths when sections of a page become visible in the viewport as the user scrolls
const useIntersectionAnimation = (sectionsRefs, pathsRefs) => {
  useEffect(() => {
    // Function to reset the path's stroke properties and animate it
    const resetAndAnimatePath = (index) => {
      const path = pathsRefs.current[index];
      if (path && typeof path.getTotalLength === 'function') {
        const pathLength = path.getTotalLength();

        path.style.transition = 'none';
        path.style.strokeDasharray = `${pathLength} ${pathLength}`;
        path.style.strokeDashoffset = pathLength;

        setTimeout(() => {
          path.style.transition = 'stroke-dashoffset 2s ease-in-out';
          path.style.strokeDashoffset = 0;
        }, 100);
      }
    };

    // Called whenever one of the observed elements enters or leaves the viewport
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const index = entry.target.getAttribute('data-index');
        if (entry.isIntersecting) {
          resetAndAnimatePath(index); // Reset and animate the path every time the section is visible
        }
      });
    };

    // Monitors when elements appear in the viewport
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0.5, // Trigger when 50% of the section is visible
    });

    sectionsRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect(); // Clean up the observer when the component is unmounted
    };
  }, [sectionsRefs, pathsRefs]);
};

export default useIntersectionAnimation;