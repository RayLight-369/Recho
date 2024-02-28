import { AnimatePresence, motion } from 'framer-motion';
import React, { memo, useState } from 'react';
import Styles from "./OptionBar.module.css";


const OptionBar = ( { setCreateChannelPopupOpen, setAddMemberPopupOpen, setAddTaskPopupOpen, isAdmin } ) => {

  const [ openOptionBar, setOpenOptionBar ] = useState( false );
  // const [ closeOptionBarDivPosition, setCloseOptionBarDivPosition ] = useState( false );


  const optionBarVariants = {
    initial: {
      // transform: "translateX(calc(-50% + 57px)) scaleX(.1)",
      width: "2.3rem",
      transition: {
        duration: .2,
      }
    },
    animate: {
      // transform: "translateX(calc(-50% + 57px)) scaleX(1)",
      width: "55%",
      transition: {
        duration: .5,
        type: "spring"
      }
    }
  };

  const OpenOptionBar = () => setOpenOptionBar( true );
  const CloseOptionBar = () => setOpenOptionBar( false );


  return (
    <motion.div className={ `${ Styles[ 'options-bar' ] } ${ openOptionBar ? Styles[ "opened" ] : undefined }` } transition={ {
      duration: .5,
      type: "spring",
      damping: 10,
      bounce: .3
    } }
      // drag
      // dragTransition={ { bounceStiffness: 600, bounceDamping: 10, min: 0, max: 0, } }
      // dragConstraints={ {
      //   top: -150,
      //   left: -150,
      //   right: 150,
      //   bottom: 150,
      // } }
      onClick={ () => {
        OpenOptionBar();
      } } variants={ optionBarVariants } animate={ openOptionBar ? "animate" : "initial" } initial="initial" exit="initial">
      <motion.div className={ Styles[ "selected-num" ] }></motion.div>
      <motion.div className={ Styles[ "minor-options" ] }>

      </motion.div>
      { isAdmin && (
        <motion.div className={ Styles[ "major-options" ] }>
          <button type='button' className={ Styles[ 'major-options-btn' ] } onClick={ () => setCreateChannelPopupOpen( true ) }>+ Create Channel</button>
          <button type='button' className={ Styles[ 'major-options-btn' ] } onClick={ () => setAddMemberPopupOpen( true ) }>+ Add Member</button>
        </motion.div>
      ) }
      <motion.div className={ `${ Styles[ "optionOpenClose" ] } ${ openOptionBar ? Styles[ "opened" ] : undefined }` }
        transition={ { type: "spring", stiffness: 400, damping: 10 } }
        onClick={ ( e ) => {
          e.stopPropagation();
          e.preventDefault();
          setOpenOptionBar( prev => !prev );
          console.log( 123 );
        } }>
        <p>{ openOptionBar ? "✖" : "☰" }</p>
      </motion.div>
    </motion.div>
  );
};

export default memo( OptionBar );