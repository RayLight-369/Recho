"use client";

import React from 'react';
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./ChildLayout.module.css";
import Header from '../Components/Header/Header';
import { AnimatePresence, motion } from 'framer-motion';

const ChildLayout = ( { children } ) => {

  let variants = {
    hidden: {
      y: -10,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1
    },
    exit: {
      y: 10,
      opacity: 0
    },
  };

  return (
    // <AnimatePresence mode='wait'>
    <div className={ styles[ 'child-layout' ] }>
      <Sidebar className={ styles.sidebar } />
      <Header className={ styles.header } />
      <section className={ styles.page } variants={ variants } transition={ { delay: .7 } } animate="animate" initial="hidden" exit="exit">
        { children }
      </section>
    </div>
    // </AnimatePresence>
  );
};

export default ChildLayout;