"use client";

import React from 'react';
import style from "./page.module.css";


const page = ( { params } ) => {



  return (
    <div className={ style.div }>
      { console.log( params ) }
    </div>
  );
};

export default page;