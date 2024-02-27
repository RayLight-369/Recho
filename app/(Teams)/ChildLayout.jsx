"use client";

import React, { useEffect } from 'react';
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./ChildLayout.module.css";
import Header from '../Components/Header/Header';
import { AnimatePresence, motion } from 'framer-motion';
import { setCurrentTeamChannel } from '../utils/setStates';
import { useData } from '../Contexts/DataContext/DataContext';
import PageWrapper from '../Components/PageWrapper/PageWrapper';

const ChildLayout = ( { children } ) => {

  const { setCurrentTeam, setCurrentChannel, data } = useData();

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
        <PageWrapper>
          { children }
        </PageWrapper>
      </section>
    </div>
    // </AnimatePresence>
  );
};

export default ChildLayout;