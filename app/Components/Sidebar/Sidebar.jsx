"use client";

import React from 'react';
import styles from "./Sidebar.module.css";
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import { useData } from '@/app/Contexts/DataContext/DataContext';

const Sidebar = ( { className } ) => {

  const { currentChannel, currentTeam } = useData();

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
        <div className={ styles[ "channels" ] }>
          { currentTeam?.channels.map( channel => (
            <p key={ channel.id }>{ channel.name }</p>
          ) ) }
        </div>
      </div>
    </AnimatePresence>
  );
};

export default Sidebar;