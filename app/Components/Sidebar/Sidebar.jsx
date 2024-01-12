"use client";

import React from 'react';
import styles from "./Sidebar.module.css";
import Image from 'next/image';

const Sidebar = ( { className } ) => {

  let teams = [ "aSxCd1S", "bSxVd1F" ];
  // let channels = {

  // };

  return (
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
  );
};

export default Sidebar;