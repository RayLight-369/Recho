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
import { HIGHER_ROLES, PRIORITY } from '@/app/utils/Constants';




const page = ( { params } ) => {

  const { setCurrentTeam, setCurrentChannel, data, currentChannel, currentTeam, dataloading, setCurrentChannelTasks, currentChannelTasks } = useData();
  const [ addMemmberPopupOpen, setAddMemmberPopupOpen ] = useState( false );
  const [ createChannelPopupOpen, setCreateChannelPopupOpen ] = useState( false );
  const [ addTaskPopupOpen, setAddTaskPopupOpen ] = useState( false );
  const router = useRouter();


  function tableToCSV () {

    const CSV_data = [
      `title,reporter,reporter_id,created,assignee,assignee_id,priority`
    ];

    currentChannelTasks.forEach( ( task ) => {
      const reporter = currentTeam.members.find( member => +member.id == +task.reporter );
      const assignee = currentTeam.members.find( member => +member.id == +task.assignee );

      CSV_data.push( `${ task.title },${ reporter?.name },${ reporter?.id },${ task.created_at },${ assignee?.name },${ assignee?.id },${ PRIORITY[ task.priority ][ 0 ] }` );
    } );

    const csv_data = CSV_data.join( "\n" );

    console.log( "datatatatata: ", CSV_data );

    const CSVFile = new Blob( [ csv_data ], {
      type: "text/csv"
    } );

    // Create to temporary link to initiate
    // download process
    const temp_link = document.createElement( 'a' );

    // Download csv file
    temp_link.download = `${ currentTeam.teamName } - ${ currentChannel.name }`;
    const url = window.URL.createObjectURL( CSVFile );
    temp_link.href = url;

    // This link should not be displayed
    temp_link.style.display = "none";
    document.body.appendChild( temp_link );

    // Automatically click the link to
    // trigger download
    temp_link.click();
    document.body.removeChild( temp_link );

  }

  function csvToTable ( e ) {
    const file = e.target.files[ 0 ];
    const reader = new FileReader();

    if ( file ) {
      reader.addEventListener( 'load', E => {
        const csvDataString = E.target.result.toString();
        console.log( 'CSV Data:', csvDataString );

        const rowsHeader = csvDataString.split( '\r' ).join( '' ).split( '\n' );
        const headers = rowsHeader[ 0 ].split( ',' );
        const content = rowsHeader.filter( ( _, i ) => i > 0 );
        console.log( 'Headers: ', headers );
        const jsonFormatted = content.map( row => {
          const columns = row.split( ',' );
          return columns.reduce( ( p, c, i ) => {
            p[ headers[ i ] ] = c;
            return p;
          }, {} );
        } );


        console.log( 'jsonFormatted:', jsonFormatted );
      } );

      reader.readAsText( file, 'UTF-8' );
    }
  }


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
              {/* <button type="button" onClick={ () => openPopUp( setAddMemmberPopupOpen ) }>Add Member</button> */ }
              <button type="button" onClick={ tableToCSV }>Export to Csv</button>
              <button type="button" className={ Styles[ 'file-btn' ] }>
                <label htmlFor="files" className={ Styles[ "btn" ] }>Import Csv</label>
                <input className={ Styles[ 'file-input' ] } id='files' name='files' type="file" accept='.csv' onChange={ csvToTable } />
              </button>
              {
                HIGHER_ROLES.includes(
                  data?.sessionData.currentUserData.current_user_teams_data.find(
                    team => team.id === currentTeam.teamID
                  )?.role
                ) ? (
                  <>
                    <button type="button" onClick={ () => openPopUp( setCreateChannelPopupOpen ) }>Create Channel</button>
                    <button type="button" onClick={ () => openPopUp( setAddMemmberPopupOpen ) }>Add Member</button>
                    <button type="button" id={ Styles[ 'add-task' ] }>Add Task</button>
                  </>
                ) : (
                  currentTeam?.teamSettings.all_members_can_add_tasks ? (
                    <button type="button" id={ Styles[ 'add-task' ] }>Add Task</button>
                  ) : null
                )
              }
            </div>
          </div>
          <TaskContainer className={ Styles[ "task-container" ] } />
        </div>
        <AnimatePresence mode='wait'>
          <OptionBar isAdmin={ HIGHER_ROLES.includes( data?.sessionData.currentUserData.current_user_teams_data.find( team => team.id == currentTeam.teamID )?.role ) } setAddMemberPopupOpen={ setAddMemmberPopupOpen } setCreateChannelPopupOpen={ setCreateChannelPopupOpen } setAddTaskPopupOpen={ setAddTaskPopupOpen } />
        </AnimatePresence>
        <AnimatePresence mode='wait'>
          { addMemmberPopupOpen && (
            <Modal handleClose={ () => closePopUp( setAddMemmberPopupOpen ) }>
              <AddMember handleClose={ () => closePopUp( setAddMemmberPopupOpen ) } />
            </Modal>
          ) }
          { addTaskPopupOpen && (
            <Modal handleClose={ () => closePopUp( setAddTaskPopupOpen ) }>
              <AddMember handleClose={ () => closePopUp( setAddTaskPopupOpen ) } />
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