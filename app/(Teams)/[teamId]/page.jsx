"use client";

import React from 'react';
import style from "./page.module.css";
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Animated from "../../../public/Imgs/animation.svg";
import Dashboard from '@/app/Components/Dashboard/Dashboard';


const page = ( { params } ) => {

  const pathName = usePathname();

  return (
    <div className={ style[ "team-section" ] }>
      { pathName === "/dashboard" ? (
        <Dashboard />
      ) : (
        <></>
      ) }
    </div>
  );
};

export default page;