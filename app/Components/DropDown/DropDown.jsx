import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from "./DropDown.module.css";


const DropDown = ( { array, dropDownOpen, toggleDropDown, label = "Name:" } ) => {

  const variants = {
    open: {
      height: "auto",
      scale: 1,
      opacity: 1
      // height: "fit-content",
    },
    close: {
      height: "0",
      scale: .7,
      opacity: 0
      // height: "0",
    }
  };

  useEffect( () => {
    const select = document.querySelector( "div#itemNames" );
    document.onclick = e => {
      if ( !select.contains( e.target ) ) toggleDropDown( false );
    };
  }, [] );

  const ToggleDropDown = () => toggleDropDown( prev => !prev );
  const closeDropDown = () => toggleDropDown( false );


  return (
    <div className={ styles[ "dropdown-container" ] } onClick={ ToggleDropDown }>
      { label && <p className={ styles[ "label" ] }>{ label }</p> }
      {/* <div className={ styles[ 'content' ] }> */ }
      <div className={ styles[ 'parent' ] }>
        <div className={ styles[ 'select' ] } data-label={ label } name="itemNames" id="itemNames" >
          <p className={ styles[ "default-item" ] }>{ array[ 0 ] }</p>
        </div>

        <AnimatePresence mode='wait'>
          { dropDownOpen && (
            <motion.div className={ styles[ "other-items" ] } variants={ variants } transition={ { duration: .15 } } animate="open" initial="close" exit="close" >
              { array.map( ( item, i ) => (
                <>
                  { i != 0 && (
                    <button type='button' key={ i } onClick={ ( e ) => {
                      closeDropDown();
                    } }>{ item }</button>
                  ) }
                </>
              ) ) }
            </motion.div>
          ) }
        </AnimatePresence>
      </div>
      {/* </div> */ }
    </div>
  );
};

export default DropDown;