"use client";

import React from 'react';
import styles from "./Sidebar.module.css";
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';

const Sidebar = ( { className } ) => {

  let teams = [ "aSxCd1S", "bSxVd1F" ];
  // let channels = {

  // };

  let variants = {
    hidden: {
      opacity: 0,
      y: -15,
      // clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
    },
    visible: {
      opacity: 1,
      y: 0,
      // clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
    },
    exit: {
      y: 0,
      opacity: 0,
      // clipPath: "polygon(50% 0, 50% 0, 49% 100%, 49% 100%)"
    }
  };

  return (
    <AnimatePresence
      variants={ variants }
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={ {
        duration: .7
      } }
    >
      <div className={ `${ styles.sidebar } ${ className && className }` }>
        <div className={ styles.logo }>
          <div className={ styles[ "icon-name" ] }>
            <Image
              src={ "/Imgs/logo.svg" }
              width={ 50 }
              height={ 50 }
            />
            <p className={ styles.title }>Recho</p>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default Sidebar;