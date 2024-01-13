"use client";

import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { getUser } from '@/Provider/Provider';
import { useData } from '../Contexts/DataContext/DataContext';

import "../globals.css";
import styles from "./page.module.css";

const page = () => {

  const router = useRouter();
  const { data: session } = useData();
  const hover = {
    scale: 1.09,
  };

  return (
    <AnimatePresence mode="wait">
      <main className={ styles.main }>
        <header className={ styles.header }>
          <div className={ styles.logo }>
            <Image
              src={ "/Imgs/logo.svg" }
              width={ 40 }
              height={ 40 }
            />
            <p className={ styles.title }>Recho</p>
          </div>
          <nav className={ styles.nav }>
            { session?.signedIn ? (
              <button onClick={ async () => {
                signOut();
              } }>LogOut</button>
            ) : (
              <button onClick={ async () => {
                signIn( "google", {
                  callbackUrl: "/protected"
                } );
              } }>Login</button>
            ) }
          </nav>
        </header>
        <div className={ styles.punchline }>
          <p className={ styles.title }>Take control of your projects with Recho</p>
          <div className={ styles.buttons }>
            <MotionConfig transition={ {
              type: 'spring',
              damping: 7,
            } }>
              <motion.button type='button' whileHover={ hover } onClick={ async () => {
                console.log( session );
                if ( !session.signedIn ) {
                  signIn( "google", {
                    callbackUrl: "/protected"
                  } );
                } else {
                  router.push( "/protected" );
                }
              } }>Try for free</motion.button>
              <motion.button disabled type='button' whileHover={ hover }>About Me</motion.button>
            </MotionConfig>
          </div>
        </div>
      </main>
    </AnimatePresence>
  );
};

export default page;