"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./ChildLayout.module.css";
import Header from '../Components/Header/Header';
import { AnimatePresence, motion } from 'framer-motion';
import { setCurrentTeamChannel, set_channel_data_after_new_channel } from '../utils/setStates';
import { useData } from '../Contexts/DataContext/DataContext';
import PageWrapper from '../Components/PageWrapper/PageWrapper';
import Modal from '../Components/Modal/Modal';
import CreateTeam from '../Components/CreateTeam/CreateTeam';
import { socket } from '@/lib/socketio';
import { toast } from 'react-toastify';

const ChildLayout = ( { children } ) => {

  const { setCurrentTeam, currentTeam, data, setData } = useData();
  const [ createTeamPopupOpen, setCreateTeamPopupOpen ] = useState( false );

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

  const openCreateTeamPopup = useCallback( () => setCreateTeamPopupOpen( true ) );
  const closeCreateTeamPopup = useCallback( () => setCreateTeamPopupOpen( false ) );

  useEffect( () => {

    const handleChannelCreation = ( { name, teamID, channelData } ) => {
      toast( `Channel #${ name } Created!` );
      console.log( `teamId is : `, teamID, ` and channel Data is : `, channelData );

      set_channel_data_after_new_channel( {
        newChannelData: channelData,
        data,
        setData,
        teamID,
        setCurrentTeam,
        currentTeam
      } );
    };

    socket.on( "channel_creation", handleChannelCreation );

    return () => {
      socket.off( "channel_creation", handleChannelCreation );
    };

  }, [] );


  return (
    // <AnimatePresence mode='wait'>
    <>
      <Sidebar className={ styles.sidebar } />
      <div className={ styles[ 'child-layout' ] }>
        <div id={ styles[ 'side-section' ] }>
          <Header className={ styles.header } openPopup={ openCreateTeamPopup } closePopup={ closeCreateTeamPopup } />
          <section className={ styles.page } variants={ variants } transition={ { delay: .7 } } animate="animate" initial="hidden" exit="exit">
            <PageWrapper>
              { children }
            </PageWrapper>
          </section>
        </div>
      </div>
      <AnimatePresence mode="wait">
        { createTeamPopupOpen && (
          <Modal handleClose={ closeCreateTeamPopup }>
            <CreateTeam handleClose={ closeCreateTeamPopup } />
          </Modal>
        ) }
      </AnimatePresence>
    </>
    // </AnimatePresence>
  );
};

export default ChildLayout;