import React from 'react';
import Styles from "./Task.module.css";
import { Reorder, motion } from 'framer-motion';

const Task = ( { task } ) => {

  return (
    <Reorder.Item value={ task } as='div' className={ Styles[ "task" ] }
      id={ task.id }
      initial={ { opacity: 0, y: 30 } }
      animate={ {
        opacity: 1,
        y: 0,
        transition: { duration: 0.15 }
      } }
      exit={ { opacity: 0, y: 20, transition: { duration: 0.3 } } }
      whileDrag={ { backgroundColor: "#e3e3e3" } }>
      <motion.p layout="position" className={ Styles[ "title" ] }>{ task?.title.length > 50 ? task?.title.slice( 0, 37 ) + "..." : task?.title }</motion.p>
      <motion.p layout className={ Styles[ "reporter" ] }>{ "Ray" }</motion.p>
      <motion.p layout className={ Styles[ "date" ] }>{ "27-feb 2024" }</motion.p>
      <motion.p layout className={ Styles[ "priority" ] }>{ "Medium" }</motion.p>
    </Reorder.Item>
  );
};

export default Task;