import React, { useState } from 'react';
import styles from "./CreateChannel.module.css";
import { MotionConfig, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useData } from '@/app/Contexts/DataContext/DataContext';
import { set_channel_data_after_new_channel, set_data_after_creating } from '@/app/utils/setStates';
import { navigateTo } from '@/app/utils/changePage';
import { toast } from 'react-toastify';
import { socket } from '@/lib/socketio';


const CreateChannel = ( { handleClose } ) => {

  const router = useRouter();
  const [ channelName, setChannelName ] = useState( "" );
  const [ channelDescription, setChannelDescription ] = useState( "" );
  const { data: session, setData, setCurrentTeam, setCurrentChannel, currentTeam, setCurrentChannelTasks, currentChannel } = useData();
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
    // const ToastID = toast.loading( "Creating Channel ..." );

    try {

      const teamsData = session.sessionData.currentUserData.current_user_teams_data;
      console.log( "previous sessionData ", session ); //supabase mein data update karne ke baad yahan update nhi ho raha data

      const response = await toast.promise( fetch( "/api/channel/create", {
        method: "POST",
        body: JSON.stringify( {
          channelName,
          channelDescription,
          userName: session.user.name,
          userId: session.user.id,
          userRole: "owner",
          userEmail: session.user.email,
          currentTeam,
          channelID: currentChannel.id,
          teamsData
        } )
      } ), {
        success: `Channel #${ channelName } Created!`,
        error: `Channel Creation Failed!`,
        pending: `Creating Channel #${ channelName }...`,
      }, {
        // autoClose: 5000,
        bodyStyle: {
          fontSize: ".85rem"
        },

      } );

      if ( response.ok ) {
        const DATA = await response.json();
        const currentTeamID = currentTeam.teamID;
        console.log( DATA );
        const new_channelsData = DATA.channelData;
        console.log( "new channels Data, ", new_channelsData );


        socket.emit( "channel_creation", { name: channelName, teamID: currentTeamID, channelData: new_channelsData } );

        // toast.update( ToastID, {
        //   render: `Channel #${ channelName } Created...`,
        //   type: "success",
        //   isLoading: false,
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   // pauseOnHover: true,
        //   draggable: true,
        //   // progress: 1,
        // } );

        set_channel_data_after_new_channel( { newChannelData: new_channelsData, teamID: currentTeamID, data: session, setData, currentTeam, setCurrentTeam } ).then( async ( { sessionData } ) => {
          router.prefetch( `/teams/${ currentTeamID }/${ DATA.channelData.id }` );

          const [ team, channel ] = navigateTo( sessionData, {
            teamId: currentTeamID,
            channelId: DATA.channelData.id,
            setCurrentTeam,
            setCurrentChannel,
            setCurrentChannelTasks
          } );

          router.push( `/teams/${ team }/${ channel }` );
        } );
      }

    } catch ( e ) {
      console.log( e );

      // toast.update( ToastID, {
      //   render: `Channel #${ channelName } Created...`,
      //   type: "error",
      //   isLoading: false,
      //   autoClose: 2000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // } );

    } finally {
      setCreating( false );
      handleClose();
      // toast.success( `A New Channel #${ new_channelsData.name } Created!`, {
      //   // position: "top-right",
      //   // autoClose: 5000,
      //   // hideProgressBar: false,
      //   pauseOnHover: true,
      //   // draggable: true,
      //   progress: undefined,
      //   // theme: "dark",
      //   // transition: "Bounce",
      // } );

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