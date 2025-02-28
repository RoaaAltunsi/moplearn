import { ReactComponent as MoneySVG } from '../../assets/images/money.svg';
import { ReactComponent as OpportunitiesSVG } from '../../assets/images/opportinities.svg';
import { ReactComponent as PartnerSVG } from '../../assets/images/partner.svg';
import useIntersectionAnimation from '../../hooks/useIntersectionAnimation';
import styles from './Homepage.module.css';
import React, { useRef } from 'react';

const sectionsData = [
   {
      idName: styles.sectionM, Image: MoneySVG, svgId: styles.svgM,
      pathData: "M8 93.0001C8 93.0001 8 15.0001 8 9.00006C8 3.00006 49.5 68.0001 49.5 68.0001C49.5 68.0001 90 2.0001 90 9.00006C90 16 90 93.0001 90 93.0001",
      title: "Money",
      descr1: "Struggling to afford courses?",
      descr2: "We've got you with a list of free and discounted courses just for you!"
   },
   {
      idName: styles.sectionO, Image: OpportunitiesSVG, svgId: styles.svgO,
      pathData: "M80 47C80 18.2206 62.5 7.99997 44 7.99998C25.5 8 7.5 21.0002 7.5 47C7.5 72.9998 28 83.5 44 83.5C60 83.5 80 70 80 47Z",
      title: "Opportunities",
      descr1: "Overwhelmed by countless educational opportunities you never knew existed?",
      descr2: "We've brings them all together in one place, so you don't miss out!"
   },
   {
      idName: styles.sectionP, Image: PartnerSVG, svgId: styles.svgP,
      pathData: "M8 51.1052C34.4787 52.7837 52.5 50.6052 52.5 32.6052C52.5 14.6052 40.4707 6.9974 8 8.10518V88.6052",
      title: "Partner",
      descr1: "Tired of learning alone?",
      descr2: "Connect with a learning partner and make your journey more engaging and fun!"
   }
]


function Homepage() {

   const sectionsRefs = useRef([]);
   const pathsRefs = useRef([]);
   // Using the custom hook to animate MOP letters in each section
   useIntersectionAnimation(sectionsRefs, pathsRefs);

   // -------------- Render Homepage section --------------
   const HomepageSection = ({ idName, index, Image, svgId, pathData, title, descr1, descr2 }) => (
      <div
         className={styles.section}
         id={idName}
         data-index={index}
         ref={el => (sectionsRefs.current[index] = el)}
      >
         {/* Letter */}
         <svg
            id={svgId}
            className={styles.svg_letter}
            viewBox="0 0 100 100"
            fill="none"
            preserveAspectRatio="xMidYMax meet"
         >
            <path
               ref={el => (pathsRefs.current[index] = el)}
               d={pathData}
               stroke="#4F5560"
               strokeWidth="15"
            />
         </svg>

         {/* Texts */}
         <div className={styles.description}>
            <h1> {title} </h1>
            <p>
               {descr1} <br />
               {descr2}
            </p>
         </div>

         {/* Image */}
         <Image className={styles.img} />
      </div>
   );


   return (
      <div className="container">         
         {sectionsData.map((item, index) => (
            <HomepageSection
               key={index}
               idName={item.idName}
               index={index}
               Image={item.Image}
               svgId={item.svgId}
               pathData={item.pathData}
               title={item.title}
               descr1={item.descr1}
               descr2={item.descr2}
            />
         ))}
      </div>
   )
}

export default Homepage;