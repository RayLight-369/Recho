"use client";

import React, { memo, useState } from 'react';
import styles from "./Sidebar.module.css";
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import { useData } from '@/app/Contexts/DataContext/DataContext';
import Link from 'next/link';
import Modal from '../Modal/Modal';
import CreateChannel from '../CreateChannel/CreateChannel';
import { setCurrentTeamChannel } from '@/app/utils/setStates';
import { HIGHER_ROLES } from '@/app/utils/Constants';

const Sidebar = ( { className } ) => {

  const { currentChannel, currentTeam, dataloading, setCurrentChannel, setCurrentTeam, data, setCurrentChannelTasks } = useData();
  const [ createChannelPopupOpen, setCreateChannelPopupOpen ] = useState( false );

  let variants = {
    hidden: {
      opacity: 0,
      y: -15,
      // clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
    },
    visible: {
      opacity: 1,
      y: 0,
      // clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
    },
    exit: {
      y: 0,
      opacity: 0,
      // clipPath: "polygon(50% 0, 50% 0, 49% 100%, 49% 100%)"
    }
  };

  const closePopUp = ( setState ) => setState( false );
  const openPopUp = ( setState ) => setState( true );

  // if ( currentTeam ) {
  return (
    <>
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
        <div className={ styles[ "channels" ] }>
          { dataloading ? <p>Loading...</p> : (
            <>
              { currentTeam?.channels.map( channel => (
                <Link href={ `/teams/${ currentTeam.teamID }/${ channel.id }` } onClick={ () => {
                  setCurrentTeamChannel( { //idhr check karna hai ke ye jo channel id url (params) ke andar hai , kyunke agar naa ho tou ye error nhin deta , usko team ke pehle channel ko render kar deta but the issue is ke url mein id usi channel ki hoti jo exist nhin karta
                    teamId: currentTeam.teamID,
                    channelId: channel.id,
                    setCurrentChannel,
                    setCurrentTeam,
                    sessionData: data.sessionData,
                    setCurrentChannelTasks
                  } );
                } } key={ channel.id } id={ channel.id == currentChannel.id ? styles[ "currentChannel" ] : undefined }>{ channel.name }</Link>
              ) ) }

              {
                currentTeam && HIGHER_ROLES.includes(
                data?.sessionData.currentUserData.current_user_teams_data.find(
                  team => team.id === currentTeam.teamID
                )?.role ) && <button type='button' id={ styles[ "createChannel" ] } onClick={ () => openPopUp( setCreateChannelPopupOpen ) }>Create Channel</button>
              }

            </>
          ) }
        </div>
      </div>
      <AnimatePresence mode='wait'>
        { createChannelPopupOpen && (
          <Modal handleClose={ () => closePopUp( setCreateChannelPopupOpen ) }>
            <CreateChannel handleClose={ () => closePopUp( setCreateChannelPopupOpen ) } />
          </Modal>
        ) }
      </AnimatePresence>
    </>
  );
  // }

};

export default memo( Sidebar );