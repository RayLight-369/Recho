"use client";

import { useData } from '@/app/Contexts/DataContext/DataContext';
import { setCurrentSessionTasks, setCurrentTeamChannel, set_data_after_creating } from '@/app/utils/setStates';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Styles from "./page.module.css";
import { AnimatePresence, motion } from 'framer-motion';
import Modal from '@/app/Components/Modal/Modal';
import AddMember from '@/app/Components/AddMember/AddMember';
import CreateChannel from '@/app/Components/CreateChannel/CreateChannel';
import OptionBar from '@/app/Components/OptionBar/OptionBar';
import TaskContainer from '@/app/Components/TaskContainer/TaskContainer';
import { HIGHER_ROLES, PRIORITY, STATUS } from '@/app/utils/Constants';
import AddTask from '@/app/Components/AddTask/AddTask';
import { navigateTo } from '@/app/utils/changePage';
import { pusherClient } from '@/lib/pusher';




const page = ( { params } ) => {

  const { setCurrentTeam, setCurrentChannel, data, setData, currentChannel, currentTeam, dataloading, setCurrentChannelTasks, currentChannelTasks } = useData();
  const [ addMemmberPopupOpen, setAddMemmberPopupOpen ] = useState( false );
  const [ createChannelPopupOpen, setCreateChannelPopupOpen ] = useState( false );
  const [ addTaskPopupOpen, setAddTaskPopupOpen ] = useState( false );
  const router = useRouter();


  function tableToCSV () {

    const CSV_data = [
      `title,description,reporter,created,assignee,priority,status,due,reporter_id,assignee_id,status_id,priority_id`
    ];

    currentChannelTasks.forEach( ( task ) => {
      const reporter = +task.reporter != 1 ? currentTeam.members.find( member => +member.id == +task.reporter ) : { name: "Any", id: 1 };
      const assignee = +task.assignee != 1 ? currentTeam.members.find( member => +member.id == +task.assignee ) : { name: "Any", id: 1 };

      CSV_data.push( `${ task.title },${ task.description },${ reporter?.name },${ task.created_at },${ assignee?.name },${ PRIORITY[ task.priority ][ 0 ] },${ STATUS[ task.status ][ 0 ] },${ task.due_date },${ reporter?.id },${ assignee?.id },${ task.status },${ task.priority }` );
    } );

    const csv_data = CSV_data.join( "\n" );

    const CSVFile = new Blob( [ csv_data ], {
      type: "text/csv"
    } );

    const temp_link = document.createElement( 'a' );

    temp_link.download = `${ currentTeam.teamName } - ${ currentChannel.name }`;
    const url = window.URL.createObjectURL( CSVFile );
    temp_link.href = url;

    temp_link.style.display = "none";
    document.body.appendChild( temp_link );

    temp_link.click();
    document.body.removeChild( temp_link );

  }

  function csvToTable ( e ) {
    const file = e.target.files[ 0 ];
    const reader = new FileReader();

    if ( file ) {
      reader.addEventListener( 'load', async E => {
        const csvDataString = E.target.result.toString();
        // console.log( 'CSV Data:', csvDataString );

        const rowsHeader = csvDataString.split( '\r' ).join( '' ).split( '\n' );
        const headers = rowsHeader[ 0 ].split( ',' );
        const content = rowsHeader.filter( ( _, i ) => i > 0 );

        const jsonFormatted = content.map( row => {
          const columns = row.split( ',' );
          return columns.reduce( ( p, c, i ) => {
            p[ headers[ i ] ] = c;
            return p;
          }, {} );
        } );


        console.log( 'jsonFormatted:', jsonFormatted );

        const formattedJsonArray = jsonFormatted.map( data => ( {
          title: data.title,
          description: data.description,
          status: +data.status_id,
          priority: +data.priority_id,
          assignee: +data.assignee_id,
          reporter: +data.reporter_id,
          created_at: data.created,
          due_date: data.due
        } ) );

        try {

          const res = await fetch( "/api/task/add", {
            method: "POST",
            body: JSON.stringify( {
              bulkData: formattedJsonArray,
              currentChannel
            } ),
            headers: {
              'Content-Type': 'application/json'
            }
          } );

          if ( res.ok ) {
            set_data_after_creating( data.user.email, setData ).then( ( { sessionData } ) => {
              navigateTo( sessionData, {
                teamId: currentTeam.teamID,
                channelId: currentChannel.id,
                setCurrentTeam,
                setCurrentChannel,
                setCurrentChannelTasks
              } );
            } );
          }


        } catch ( e ) {
          console.log( e );
        }

      } );

      reader.readAsText( file, 'UTF-8' );
    }
  }


  useEffect( () => {

    // tm:${ prevTeamRes.data[ 0 ].id; }

    if ( currentTeam && currentChannel ) {

      pusherClient.subscribe( `tm=${ currentTeam.teamID }` ).bind( "channel-create", () => {
        set_data_after_creating( data.user.email, setData, null ).then( ( { sessionData } ) => {
          navigateTo( sessionData, {
            teamId: currentTeam.teamID,
            channelId: currentChannel.id,
            setCurrentChannel,
            setCurrentChannelTasks,
            setCurrentTeam
          } );
        } );
      } );

    }

  }, [ currentTeam, currentChannel ] );


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
        router.replace( `/ teams / ${ team } / ${ channel }` );
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
                    <button type="button" onClick={ () => openPopUp( setAddTaskPopupOpen ) } id={ Styles[ 'add-task' ] }>Add Task</button>
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
              <AddTask handleClose={ () => closePopUp( setAddTaskPopupOpen ) } />
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

export default page;;