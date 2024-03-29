"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./ChildLayout.module.css";
import Header from '../Components/Header/Header';
import { AnimatePresence, motion } from 'framer-motion';
import { setCurrentTeamChannel, set_channel_data_after_new_channel, set_tasks_data_after_new_tasks } from '../utils/setStates';
import { useData } from '../Contexts/DataContext/DataContext';
import PageWrapper from '../Components/PageWrapper/PageWrapper';
import Modal from '../Components/Modal/Modal';
import CreateTeam from '../Components/CreateTeam/CreateTeam';
import { socket } from '@/lib/socketio';
import { toast } from 'react-toastify';

const ChildLayout = ( { children } ) => {

  const { setCurrentTeam, currentTeam, data, setData, setCurrentChannel, currentChannel, setCurrentChannelTasks } = useData();
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

      // if ( Object.keys( data ).length ) {
      set_channel_data_after_new_channel( {
        newChannelData: channelData,
        data,
        setData,
        teamID,
        setCurrentTeam,
        setCurrentChannel,
        currentChannel,
        currentTeam
      } );
      // }
    };

    const handleTasksCreation = ( { teamID, tasksData, channelID } ) => {
      toast( `A New Task Added!` );
      console.log( `teamId is : `, teamID, ` and channel Data is : `, tasksData );

      // if ( Object.keys( data ).length ) {
      set_tasks_data_after_new_tasks( {
        newTasksData: tasksData,
        teamID: teamID,
        channelID,
        setCurrentChannel,
        setCurrentChannelTasks,
        setCurrentTeam,
        currentChannel,
        currentTeam,
        data,
        setData,
      } ).then( ( { sessionData } ) => console.log( sessionData ) );
      // }
    };

    if ( Object.keys( data ).length ) {

      socket.on( "channel_creation", handleChannelCreation );
      socket.on( "task_creation", handleTasksCreation );

    }

    return () => {
      socket.off( "channel_creation", handleChannelCreation );
      socket.off( "task_creation", handleTasksCreation );
    };

  }, [ data ] );


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