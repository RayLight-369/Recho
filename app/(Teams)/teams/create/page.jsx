"use client";

import React from 'react';
import style from "./page.module.css";
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Dashboard from '@/app/Components/Dashboard/Dashboard';


const page = ( { params } ) => {

  const pathName = usePathname();

  return (
    <div className={ style[ "team-section" ] }>
      <Dashboard />
    </div>
  );
};

export default page;