"use client";

import React from 'react';
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./ChildLayout.module.css";

const ChildLayout = ( { children } ) => {
  return (
    <div id={ styles[ 'child-layout' ] }>
      <Sidebar />
      { children }
    </div>
  );
};

export default ChildLayout;