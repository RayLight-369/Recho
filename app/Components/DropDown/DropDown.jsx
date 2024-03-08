import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import styles from "./DropDown.module.css";


const DropDown = ( { array, any = false, dropDownOpen, toggleDropDown, label, backWorkArray, setState } ) => {

  // const ref = useRef();
  if ( any && !array.includes( "Any" ) ) {
    array.unshift( "Any" );
    backWorkArray.unshift( 1 );
  };

  const [ selected, setSelected ] = useState( "Any" );

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

    if ( backWorkArray ) {
      setState( backWorkArray[ 0 ] );
    } else {
      setState( array[ 0 ] );
    }

    console.log( label, `div[name=${ label }]` );

    const select = document.querySelector( `div[name=${ label }]` );
    document.onclick = e => {
      // console.log( "select: ", select, "target: ", e.target );
      // console.log()
      if ( !select.contains( e.target ) && select != e.target ) toggleDropDown( false );
    };

    // return () => {
    //   document.onclick = null;
    // };
  }, [] );

  const ToggleDropDown = ( e ) => {
    e.stopPropagation();
    toggleDropDown( prev => !prev );
  };
  const closeDropDown = () => toggleDropDown( false );


  return (
    <div className={ styles[ "dropdown-container" ] } key={ label } name={ label } onClick={ ToggleDropDown }>
      { label && <p className={ styles[ "label" ] }>{ label }</p> }
      {/* <div className={ styles[ 'content' ] }> */ }
      <div className={ styles[ 'parent' ] }>
        <div className={ styles[ 'select' ] } id={ label } >
          <p className={ styles[ "default-item" ] }>{ selected }</p>
        </div>

        <AnimatePresence mode='wait'>
          { dropDownOpen && (
            <motion.div className={ styles[ "other-items" ] } variants={ variants } transition={ { duration: .15 } } animate="open" initial="close" exit="close" >
              { array.map( ( item, i ) => (
                <>
                  { item != selected && (
                    <button type='button' key={ i } onClick={ ( e ) => {
                      e.stopPropagation();

                      if ( backWorkArray ) {
                        setState( backWorkArray[ i ] );
                      } else {
                        setState( array[ i ] );
                      }

                      setSelected( item );
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