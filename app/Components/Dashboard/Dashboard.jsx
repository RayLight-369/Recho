import React, { useEffect, useState } from 'react';
import styles from "./Dashboard.module.css";
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import ReactModal from 'react-modal';
import Modal from '../Modal/Modal';
import CreateTeam from '../CreateTeam/CreateTeam';
import { useData } from '@/app/Contexts/DataContext/DataContext';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { socket } from '@/lib/socketio';

const Dashboard = () => {

  const { data: session } = useData();
  // const router = useRouter();

  let hoverAnimation = {
    scale: 1.05
  };
  let clickAnimation = {
    scale: .96
  };

  const [ CreateTeamPopupIsOpen, setCreateTeamPopupIsOpen ] = useState( false );
  const [ type, setType ] = useState( "create" );

  const close = () => setCreateTeamPopupIsOpen( false );

  useEffect( () => {
    if ( "signedIn" in session && !session.signedIn ) {
      console.log( session );
      signIn( "google" );
    } else if ( session?.user ) {
      // socket.connect();
      socket.emit( "newConnection", {
        id: session.user.id,
        name: session.user.name
      } );
    }
  }, [ session ] );

  return (
    <div className={ styles.dashboard }>
      <AnimatePresence mode='wait'>
        { CreateTeamPopupIsOpen && (
          <Modal isOpen={ CreateTeamPopupIsOpen } handleClose={ close }>
            <CreateTeam handleClose={ close } type={ type } />
          </Modal>
        ) }
      </AnimatePresence>
      <MotionConfig transition={ {
        type: "spring",
        damping: 7
      } }>
        <motion.button className={ styles[ 'dashboard-button' ] } title='create a new Team' type="button" whileHover={ hoverAnimation } whileTap={ clickAnimation } onClick={ () => {
          setType( "create" );
          setCreateTeamPopupIsOpen( true );
        } }>Create a Team</motion.button>
        <motion.button className={ styles[ 'dashboard-button' ] } title='join a new Team' type="button" whileHover={ hoverAnimation } whileTap={ clickAnimation } onClick={ () => {
          setType( "join" );
          setCreateTeamPopupIsOpen( true );
        } }>Join a Team</motion.button>
      </MotionConfig>
    </div>
  );
};

export default Dashboard;