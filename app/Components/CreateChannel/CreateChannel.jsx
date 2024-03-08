import React, { useState } from 'react';
import styles from "./CreateChannel.module.css";
import { MotionConfig, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useData } from '@/app/Contexts/DataContext/DataContext';
import { set_data_after_creating } from '@/app/utils/setStates';
import { navigateTo } from '@/app/utils/changePage';


const CreateChannel = ( { handleClose } ) => {

  const router = useRouter();
  const [ channelName, setChannelName ] = useState( "" );
  const [ channelDescription, setChannelDescription ] = useState( "" );
  const { data: session, setData, setCurrentTeam, setCurrentChannel, currentTeam } = useData();
  const [ creating, setCreating ] = useState( false );

  const buttonWhileHovering = ( scale = 1.1, duration = .1 ) => ( {
    scale,
    transition: {
      duration
    }
  } );

  // const inputWhileFocused = {
  //   scale: 1.06,
  // };

  async function createChannel () {
    // navigateTo( session );
    if ( !channelName.trim().length ) return;
    setCreating( true );

    try {

      const teamsData = session.sessionData.currentUserData.current_user_teams_data;
      console.log( "previous sessionData ", session ); //supabase mein data update karne ke baad yahan update nhi ho raha data

      const response = await fetch( "/api/channel/create", {
        method: "POST",
        body: JSON.stringify( {
          channelName,
          channelDescription,
          userName: session.user.name,
          userId: session.user.id,
          userRole: "owner",
          userEmail: session.user.email,
          currentTeam,
          teamsData
        } )
      } );

      if ( response.ok ) {
        const DATA = await response.json();
        console.log( DATA );
        const new_channelsData = DATA.channelData;
        console.log( "new channels Data, ", new_channelsData );

        set_data_after_creating( session.user.email, setData ).then( async ( { sessionData } ) => {
          router.prefetch( `/teams/${ currentTeam.teamID }/${ DATA.channelData.id }` );

          const [ team, channel ] = navigateTo( sessionData, {
            teamId: currentTeam.teamID,
            channelId: DATA.channelData.id,
            setCurrentTeam,
            setCurrentChannel
          } );

          router.push( `/teams/${ team }/${ channel }` );
          handleClose();
        } );
      }

    } catch ( e ) {
      console.log( e );
    } finally {
      setCreating( false );
    }
  }

  return (
    <MotionConfig transition={ { type: "spring", damping: 7 } } >
      <div className={ styles[ "create-channel" ] }>
        <div className={ styles[ "header" ] }>
          <p className={ styles[ "title" ] }>Create New Channel</p>
          <motion.button type='button' whileHover={ buttonWhileHovering( 1.2, .2 ) } className={ styles[ 'close' ] } onClick={ handleClose }>✖</motion.button>
        </div>
        <div className={ styles[ "inputs" ] }>
          <input type="text" placeholder='Channel Name' className={ styles[ "name" ] } value={ channelName } onChange={ e => setChannelName( e.target.value ) } />
          <input type="text" placeholder='Channel description' className={ styles[ "description" ] } value={ channelDescription } onChange={ e => setChannelDescription( e.target.value ) } />
        </div>
        <div className={ styles[ "buttons" ] }>
          <motion.button
            whileHover={ buttonWhileHovering( 1.1, .2 ) }
            className={ styles[ "create-button" ] }
            onClick={ createChannel }
            disabled={ creating }
          >
            { creating ? "Creating..." : "Create" }
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

export default CreateChannel;