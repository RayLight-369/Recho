import React, { useState } from 'react';
import styles from "./AddTask.module.css";
import { MotionConfig, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useData } from '@/app/Contexts/DataContext/DataContext';
import { set_data_after_creating } from '@/app/utils/setStates';
import { navigateTo } from '@/app/utils/changePage';
import DropDown from '../DropDown/DropDown';
import { PRIORITY } from '@/app/utils/Constants';


const AddTask = ( { handleClose } ) => {

  const router = useRouter();
  const [ taskTitle, setTaskTitle ] = useState( "" );
  const [ taskDescription, setDescription ] = useState( "" );
  const [ priority, setPriority ] = useState( 0 );
  const [ assignee, setAssignee ] = useState( 0 );
  const [ reporter, setReporter ] = useState( 0 );
  const { data: session, setData, setCurrentTeam, setCurrentChannel, currentTeam, currentChannel, setCurrentChannelTasks } = useData();
  const [ adding, setAdding ] = useState( false );


  const [ priorityDropDown, togglePriorityDropDown ] = useState( false );
  const [ assigneeDropDown, toggleAssigneeDropDown ] = useState( false );
  const [ reporterDropDown, toggleReporterDropDown ] = useState( false );

  // const [ priorityInput, setPriorityInput ] = useState( "" );
  // const [ assigneeInput, setAssigneeInput ] = useState( "" );
  // const [ reporterInput, setReporterInput ] = useState( "" );
  const currentDate = new Date();
  const [ dateInput, setDateInput ] = useState( `${ currentDate.getFullYear() }-${ currentDate.getMonth() + 1 >= 10 ? currentDate.getMonth() + 1 : "0" + ( currentDate.getMonth() + 1 ) }-${ currentDate.getDate() > 9 ? currentDate.getDate() : "0" + currentDate.getDate() }` );


  const buttonWhileHovering = ( scale = 1.1, duration = .1 ) => ( {
    scale,
    transition: {
      duration
    }
  } );

  // const inputWhileFocused = {
  //   scale: 1.06,
  // };

  async function addTask () {

    setAdding( true );

    const dateParts = dateInput.split( "-" );

    [ dateParts[ 0 ], dateParts[ 2 ] ] = [ dateParts[ 2 ], dateParts[ 0 ] ];

    const due_date = dateParts.join( "-" );

    const ReqData = {
      priority, reporter, assignee, due_date, title: taskTitle, description: taskDescription, currentChannel, status: 0
    };


    if ( !taskTitle.trim().length ) return;

    try {

      const res = await fetch( "/api/task/add", {
        method: 'POST',
        body: JSON.stringify( ReqData ),
        headers: {
          'Content-Type': 'application/json'
        }
      } );

      if ( res.ok ) {
        const body = await res.json();
        console.log( body );
        set_data_after_creating( session.user.email, setData, body ).then( ( { sessionData } ) => {
          navigateTo( sessionData, {
            teamId: currentTeam.teamID,
            channelId: currentChannel.id,
            setCurrentTeam,
            setCurrentChannel,
            setCurrentChannelTasks
          } );
        } );
        handleClose();
      }

    } catch ( e ) {
      console.log( e );
    } finally {
      setAdding( false );
    }

  }

  return (
    <MotionConfig transition={ { type: "spring", damping: 7 } } >
      <div className={ styles[ "add-task" ] }>
        <div className={ styles[ "header" ] }>
          <p className={ styles[ "title" ] }>Add New Task</p>
          <motion.button type='button' whileHover={ buttonWhileHovering( 1.2, .2 ) } className={ styles[ 'close' ] } onClick={ handleClose }>✖</motion.button>
        </div>
        <div className={ styles[ "inputs" ] }>
          <input type="text" placeholder='Task Title' className={ styles[ "name" ] } value={ taskTitle } onChange={ e => setTaskTitle( e.target.value ) } />
          <textarea placeholder='Task Description' className={ styles[ "description" ] } value={ taskDescription } onChange={ e => setDescription( e.target.value ) } />
        </div>
        <div className={ styles[ "infos" ] }>
          <DropDown key={ "priority" } setState={ setPriority } backWorkArray={ [ 0, 1, 2, 3 ] } array={ PRIORITY.map( priority => priority[ 0 ] ) } label='Priority' dropDownOpen={ priorityDropDown } toggleDropDown={ togglePriorityDropDown } />
          <DropDown key={ "assignee" } setState={ setAssignee } any backWorkArray={ currentTeam.members.map( member => member.id ) } array={ currentTeam.members.map( member => member.name ) } label='Assignee' dropDownOpen={ assigneeDropDown } toggleDropDown={ toggleAssigneeDropDown } />
          <DropDown key={ "reporter" } setState={ setReporter } any backWorkArray={ currentTeam.members.map( member => member.id ) } array={ currentTeam.members.map( member => member.name ) } label='Reporter' dropDownOpen={ reporterDropDown } toggleDropDown={ toggleReporterDropDown } />
          <div className={ styles[ "due-date" ] }>
            <label htmlFor="dueDateInput">Due Date:</label>
            <input onChange={ ( e ) => {
              setDateInput( e.target.value );
            } } value={ dateInput } type="date" name="dueDateInput" id="dueDateInput" className={ styles[ 'due-date-input' ] } placeholder='dd-mm-yyyy' />
          </div>
        </div>
        <div className={ styles[ "buttons" ] }>
          <motion.button
            whileHover={ buttonWhileHovering( 1.1, .2 ) }
            className={ styles[ "add-button" ] }
            onClick={ addTask }
            disabled={ adding }
          >
            { adding ? "Adding..." : "Add" }
          </motion.button>
          <motion.button
            whileHover={ buttonWhileHovering( 1.1, .2 ) }
            className={ styles[ "cancel-button" ] }
            onClick={ handleClose }
          >
            Cancel
          </motion.button>
        </div>
      </div>
    </MotionConfig>
  );
};

export default AddTask;