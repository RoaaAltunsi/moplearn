import { Fragment } from 'react';
import styles from './Tabs.module.css';

function Tabs({
   tabs,
   activeTab,
   onTabChange
}) {

   return (
      <div className={styles.container}>

         {tabs.map((tab, index) => (
            <Fragment key={index}>
               {/* Tab title */}
               <div
                  className={`${styles.tab_item} ${tab === activeTab ? styles.active : ''}`}
                  onClick={() => onTabChange(tab)}
               >
                  <h3> {tab} </h3>
               </div>

               {/* Divider between each two tabs */}
               {index < tabs.length - 1 && (
                  <span className={styles.divider}> | </span>
               )}
            </Fragment>
         ))}

      </div>
   )
};

export default Tabs;