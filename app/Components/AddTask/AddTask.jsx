import React, { useState } from 'react';
import styles from "./AddTask.module.css";
import { MotionConfig, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useData } from '@/app/Contexts/DataContext/DataContext';
import { set_data_after_creating_new_team } from '@/app/utils/setStates';
import { navigateTo } from '@/app/utils/changePage';


const AddTask = ( { handleClose } ) => {

  const router = useRouter();
  const [ taskTitle, setTaskTitle ] = useState( "" );
  const [ taskDescription, setDescription ] = useState( "" );
  const [ priority, setPriority ] = useState( 0 );
  const [ assignee, setAssignee ] = useState( 0 );
  const [ reporter, setReporter ] = useState( 0 );
  const { data: session, setData, setCurrentTeam, setCurrentChannel } = useData();
  const [ adding, setAdding ] = useState( false );

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
    // navigateTo( session );
    if ( !taskTitle.trim().length ) return;

  }

  return (
    <MotionConfig transition={ { type: "spring", damping: 7 } } >
      <div className={ styles[ "add-member" ] }>
        <div className={ styles[ "header" ] }>
          <p className={ styles[ "title" ] }>Add New Member</p>
          <motion.button type='button' whileHover={ buttonWhileHovering( 1.2, .2 ) } className={ styles[ 'close' ] } onClick={ handleClose }>✖</motion.button>
        </div>
        <div className={ styles[ "inputs" ] }>
          <input type="text" placeholder='Task Title' className={ styles[ "name" ] } value={ taskTitle } onChange={ e => setTaskTitle( e.target.value ) } />
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