import { useData } from '@/app/Contexts/DataContext/DataContext';
import { AnimatePresence, Reorder } from 'framer-motion';
import React, { memo, useEffect } from 'react';
import Task from '../Task/Task';

import Styles from "./TaskContainer.module.css";

const TaskContainer = () => {

  const { setCurrentChannelTasks, currentChannelTasks, data, dataloading } = useData();

  useEffect( () => {
    console.log( "tasksksks: ", currentChannelTasks );
  }, [ data ] );

  if ( dataloading ) return <p>Loading...</p>;

  if ( currentChannelTasks?.length ) {
    return (
      <Reorder.Group as='div' className={ Styles[ 'tasks-container' ] } onReorder={ setCurrentChannelTasks } values={ currentChannelTasks } axis='y' >
        <AnimatePresence initial={ false }>
          { currentChannelTasks?.map( ( task, i ) => (
            <Task task={ task } key={ task.id } />
          ) ) }
        </AnimatePresence>
      </Reorder.Group>
    );
  }
};

export default memo( TaskContainer );