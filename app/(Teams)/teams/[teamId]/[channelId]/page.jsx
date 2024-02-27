"use client";

import { useData } from '@/app/Contexts/DataContext/DataContext';
import { setCurrentTeamChannel } from '@/app/utils/setStates';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Styles from "./page.module.css";
import { AnimatePresence } from 'framer-motion';
import Modal from '@/app/Components/Modal/Modal';
import AddMember from '@/app/Components/AddMember/AddMember';
import CreateChannel from '@/app/Components/CreateChannel/CreateChannel';




const page = ( { params } ) => {

  const { setCurrentTeam, setCurrentChannel, data, currentChannel, currentTeam, dataloading } = useData();
  const [ addMemmberPopupOpen, setAddMemmberPopupOpen ] = useState( false );
  const [ createChannelPopupOpen, setCreateChannelPopupOpen ] = useState( false );
  const [ addTaskPopupOpen, setAddTaskPopupOpen ] = useState( false );

  const router = useRouter();

  useEffect( () => {
    console.log( data );
    if ( "signedIn" in data && data.signedIn ) {
      setCurrentTeamChannel( {
        teamId: params.teamId,
        channelId: params.channelId,
        setCurrentChannel,
        setCurrentTeam,
        sessionData: data.sessionData
      } );
    }
  }, [ data ] );

  if ( dataloading ) {
    return (
      <div className={ Styles[ "channel-container" ] }>
        <p>Loading...</p>
      </div>
    );
  }


  const closePopUp = ( setState ) => {
    setState( false );
  };
  const openPopUp = ( setState ) => {
    setState( true );
  };

  return (
    <>
      <div className={ Styles[ "channel-container" ] }>
        <div className={ Styles[ "channel-intro" ] }>
          <div className={ Styles[ "name-date" ] }>
            <p className={ Styles[ "name" ] }>
              { currentChannel?.name }
            </p>
            <p className={ Styles[ "date" ] }>
              { currentChannel?.created_at }
            </p>
          </div>
          <div className={ Styles[ "buttons" ] }>
            <button type="button" onClick={ () => openPopUp( setCreateChannelPopupOpen ) }>Create Channel</button>
            <button type="button" onClick={ () => openPopUp( setAddMemmberPopupOpen ) }>Add Member</button>
            <button type="button" id={ Styles[ 'add-task' ] }>Add Task</button>
          </div>
        </div>
      </div>
      <AnimatePresence mode='wait'>
        { addMemmberPopupOpen && (
          <Modal handleClose={ () => closePopUp( setAddMemmberPopupOpen ) }>
            <AddMember handleClose={ () => closePopUp( setAddMemmberPopupOpen ) } />
          </Modal>
        ) }
        { createChannelPopupOpen && (
          <Modal handleClose={ () => closePopUp( setCreateChannelPopupOpen ) }>
            <CreateChannel handleClose={ () => closePopUp( setCreateChannelPopupOpen ) } />
          </Modal>
        ) }
      </AnimatePresence>
    </>
  );
};

export default page;