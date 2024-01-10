"use client";

import React from 'react';
import styles from "./Sidebar.module.css";
import Image from 'next/image';

const Sidebar = () => {

  let teams = [ "aSxCd1S", "bSxVd1F" ];
  // let channels = {

  // };

  return (
    <div className={ styles.sidebar }>
      <div className={ styles.logo }>
        <div className={ styles[ "icon-name" ] }>
          <Image
            src={ "/Imgs/logo.svg" }
            width={ 40 }
            height={ 40 }
          />
          <p className={ styles.title }>Recho</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;