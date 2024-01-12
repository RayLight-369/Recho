"use client";

import React from 'react';
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./ChildLayout.module.css";
import Header from '../Components/Header/Header';
import { AnimatePresence } from 'framer-motion';

const ChildLayout = ( { children } ) => {
  return (
    // <AnimatePresence mode='wait'>
    <div className={ styles[ 'child-layout' ] }>
      <Sidebar className={ styles.sidebar } />
      <Header className={ styles.header } />
      <section className={ styles.page }>
        { children }
      </section>
    </div>
    // </AnimatePresence>
  );
};

export default ChildLayout;