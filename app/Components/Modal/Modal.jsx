import React from 'react';
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Modal.module.css";

const Modal = ( { children, handleClose, customClassName } ) => {

  const variants = {
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      // transition: {
      //   duration: .5,
      //   type: "spring"
      // }
    },
    hidden: {
      opacity: 0,
      y: "-100vh",
      scale: .9
    },
    exit: {
      opacity: 0,
      y: "100vh",
      scale: .8
    }
  };

  return (
    // <AnimatePresence mode='wait'>
    <motion.div
      className={ styles.overlay }
      initial={ { opacity: 0 } }
      animate={ { opacity: 1 } }
      exit={ { opacity: 0 } }
      onClick={ handleClose }
    >
      <motion.div
        className={ `${ styles.modal } ${ customClassName && customClassName }` }
        variants={ variants }
        animate="animate"
        initial="hidden"
        exit="exit"
        onClick={ e => e.stopPropagation() }
      >
        { children }
      </motion.div>
    </motion.div >
    // </AnimatePresence>
  );
};

export default Modal;