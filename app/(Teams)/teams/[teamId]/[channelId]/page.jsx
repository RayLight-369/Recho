"use client";

import { useData } from '@/app/Contexts/DataContext/DataContext';
import { setCurrentTeamChannel } from '@/app/utils/setStates';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Styles from "./page.module.css";
import { AnimatePresence, motion } from 'framer-motion';
import Modal from '@/app/Components/Modal/Modal';
import AddMember from '@/app/Components/AddMember/AddMember';
import CreateChannel from '@/app/Components/CreateChannel/CreateChannel';
import OptionBar from '@/app/Components/OptionBar/OptionBar';
import TaskContainer from '@/app/Components/TaskContainer/TaskContainer';




const page = ( { params } ) => {

  const { setCurrentTeam, setCurrentChannel, data, currentChannel, currentTeam, dataloading, setCurrentChannelTasks } = useData();
  const [ addMemmberPopupOpen, setAddMemmberPopupOpen ] = useState( false );
  const [ createChannelPopupOpen, setCreateChannelPopupOpen ] = useState( false );
  const [ addTaskPopupOpen, setAddTaskPopupOpen ] = useState( false );

  const router = useRouter();

  useEffect( () => {

    if ( currentChannel?.id == params.channelId ) return;

    console.log( data );
    if ( "signedIn" in data && data.signedIn ) {
      const [ team, channel ] = setCurrentTeamChannel( { //idhr check karna hai ke ye jo channel id url (params) ke andar hai , kyunke agar naa ho tou ye error nhin deta , usko team ke pehle channel ko render kar deta but the issue is ke url mein id usi channel ki hoti jo exist nhin karta
        teamId: params.teamId,
        channelId: params.channelId,
        setCurrentChannel,
        setCurrentChannelTasks,
        setCurrentTeam,
        sessionData: data.sessionData
      } );

      if ( team != params.teamId || channel != params.channelId ) {
        router.replace( `/teams/${ team }/${ channel }` );
      }
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

  if ( currentTeam ) {

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
              {/* <button type="button" onClick={ () => openPopUp( setAddMemmberPopupOpen ) }>Add Member</button> */ }
              { data?.sessionData.currentUserData.current_user_teams_data.find( team => team.id == currentTeam.teamID )?.role == "owner" && (
                <>
                  <button type="button" onClick={ () => openPopUp( setAddMemmberPopupOpen ) }>Add Member</button>
                  <button type="button" id={ Styles[ 'add-task' ] }>Add Task</button>
                </>
              ) }
            </div>
          </div>
          <TaskContainer />
        </div>
        <AnimatePresence mode='wait'>
          <OptionBar setAddMemberPopupOpen={ setAddMemmberPopupOpen } setCreateChannelPopupOpen={ setCreateChannelPopupOpen } />
        </AnimatePresence>
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
};

export default page;