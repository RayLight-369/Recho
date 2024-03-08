import { useData } from '@/app/Contexts/DataContext/DataContext';
import { AnimatePresence, Reorder } from 'framer-motion';
import React, { memo, useEffect } from 'react';
import Task from '../Task/Task';

import Styles from "./TaskContainer.module.css";

const TaskContainer = ( { className } ) => {

  const { setCurrentChannelTasks, currentChannelTasks, data, dataloading, currentTeam } = useData();

  useEffect( () => {
    console.log( "tasksksks: ", currentChannelTasks );
  }, [ data ] );

  if ( dataloading ) return <p>Loading...</p>;

  if ( currentChannelTasks?.length ) {
    return (
      <Reorder.Group as='div' className={ className } id={ Styles[ 'tasks-container' ] } onReorder={ setCurrentChannelTasks } values={ currentChannelTasks } axis='y' >
        <div id={ Styles[ "headings" ] }>
          <p>Title</p>
          <p>Reporter</p>
          <p>Created</p>
          <p>Assignee</p>
          <p>Priority</p>
        </div>
        <div id={ Styles[ "container" ] }>
          <AnimatePresence initial={ false }>
            { currentChannelTasks?.map( ( task ) => (
              <Task task={ task } key={ task.id } currentTeam={ currentTeam } />
            ) ) }
          </AnimatePresence>
        </div>
      </Reorder.Group>
    );
  }
};

export default memo( TaskContainer );