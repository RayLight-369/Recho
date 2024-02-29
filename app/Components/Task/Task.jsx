import React from 'react';
import Styles from "./Task.module.css";
import { Reorder, motion } from 'framer-motion';
import { PRIORITY, STATUS } from '@/app/utils/Constants';

const Task = ( { task } ) => {

  return (
    <Reorder.Item value={ task } as='div' className={ Styles[ "task" ] }
      style={ {
        borderLeft: `4px solid ${ STATUS[ task.status ][ 1 ] }`
      } }
      id={ task.id }
      initial={ { opacity: 0, y: 30 } }
      animate={ {
        opacity: 1,
        y: 0,
        transition: { duration: 0.15 }
      } }
      exit={ { opacity: 0, y: 20, transition: { duration: 0.3 } } }
      whileDrag={ { scale: 1.04, boxShadow: `0 0 10px rgba(0 , 0, 0, .3)` } }
      whileHover={ { backgroundColor: `${ STATUS[ task.status ][ 2 ] }` } }
    >

      <motion.p layout="position" className={ Styles[ "title" ] } >
        { task?.title.length > 50 ? task?.title.slice( 0, 37 ) + "..." : task?.title }
      </motion.p>
      <motion.p layout className={ Styles[ "reporter" ] }>{ "Ray" }</motion.p>
      <motion.p layout className={ Styles[ "date" ] }>{ "27-feb 2024" }</motion.p>
      <motion.p layout className={ Styles[ "assignee" ] }>{ "Bay" }</motion.p>
      <motion.p layout className={ Styles[ "priority" ] } style={ {
        color: `${ PRIORITY[ task.priority ][ 1 ] }`,
        background: `${ PRIORITY[ task.priority ][ 2 ] }`,
        border: `1px solid ${ PRIORITY[ task.priority ][ 1 ] }30`
      } }>{ PRIORITY[ task.priority ][ 0 ] }</motion.p>
    </Reorder.Item>
  );
};

export default Task;