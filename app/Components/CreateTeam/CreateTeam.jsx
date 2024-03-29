import React, { useState } from 'react';
import styles from "./CreateTeam.module.css";
import { MotionConfig, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useData } from '@/app/Contexts/DataContext/DataContext';
import { set_data_after_creating } from '@/app/utils/setStates';
import { navigateTo } from '@/app/utils/changePage';
import { socket } from '@/lib/socketio';


const CreateTeam = ( { handleClose, type = "create" } ) => {

  const router = useRouter();
  const [ teamName, setTeamName ] = useState( "" );
  const [ teamID, setTeamID ] = useState( "" );
  const [ teamDescription, setTeamDescription ] = useState( "" );
  const { data: session, setData, setCurrentTeam, setCurrentChannel, setCurrentChannelTasks } = useData();
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

  async function createTeam () {
    // navigateTo( session );
    if ( !teamName.trim().length ) return;
    setCreating( true );

    try {

      const teamsData = session.sessionData.currentUserData.current_user_teams_data;
      console.log( "previous sessionData ", session ); //supabase mein data update karne ke baad yahan update nhi ho raha data

      const response = await fetch( "/api/team/create", {
        method: "POST",
        body: JSON.stringify( {
          teamName,
          teamDescription,
          userName: session.user.name,
          userId: session.user.id,
          userRole: "owner",
          userEmail: session.user.email,
          teamsData
        } )
      } );

      if ( response.ok ) {
        const DATA = await response.json();
        console.log( DATA );
        const new_teamsData = DATA.userData[ 0 ].teamsData;
        console.log( "new teams Data, ", new_teamsData );


        set_data_after_creating( session.user.email, setData ).then( async ( { sessionData } ) => {
          router.prefetch( `/teams/${ DATA.data.id }/${ DATA.data.channel_ids[ 0 ][ 0 ] }` );

          const [ team, channel ] = navigateTo( sessionData, {
            teamId: DATA.data.id,
            channelId: DATA.data.channel_ids[ 0 ][ 0 ],
            setCurrentTeam,
            setCurrentChannel,
            setCurrentChannelTasks
          } );

          handleClose();
          router.push( `/teams/${ team }/${ channel }` );
        } );
      }

    } catch ( e ) {
      console.log( e );
    } finally {
      setCreating( false );
    }
  }

  async function joinTeam () {
    // navigateTo( session );
    if ( !teamID.trim().length ) return;
    setCreating( true );

    try {

      const teamsData = session.sessionData.currentUserData.current_user_teams_data;
      console.log( "previous sessionData ", session ); //supabase mein data update karne ke baad yahan update nhi ho raha data

      const response = await fetch( "/api/team/join", {
        method: "POST",
        body: JSON.stringify( {
          userName: session.user.name,
          userId: session.user.id,
          userEmail: session.user.email,
          invite_link: teamID,
          teamsData
        } )
      } );

      if ( response.ok ) {
        const DATA = await response.json();
        console.log( DATA );
        const new_teamsData = DATA.userData[ 0 ].teamsData;
        console.log( "new teams Data, ", new_teamsData );

        socket.emit( "member_join", {
          teamID: DATA.TeamData.id,
          memberID: DATA.userData[ 0 ].id
        } );

        set_data_after_creating( session.user.email, setData ).then( async ( { sessionData } ) => {
          router.prefetch( `/teams/${ DATA.TeamData.id }/${ DATA.TeamData.channel_ids[ 0 ][ 0 ] }` );

          const [ team, channel ] = navigateTo( sessionData, {
            teamId: DATA.TeamData.id,
            channelId: DATA.TeamData.channel_ids[ 0 ][ 0 ],
            setCurrentTeam,
            setCurrentChannel,
            setCurrentChannelTasks
          } );

          handleClose();
          router.push( `/teams/${ team }/${ channel }` );
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
      <div className={ styles[ "create-team" ] }>
        <div className={ styles[ "header" ] }>
          <p className={ styles[ "title" ] }>{ type } New Team</p>
          <motion.button type='button' whileHover={ buttonWhileHovering( 1.2, .2 ) } className={ styles[ 'close' ] } onClick={ handleClose }>✖</motion.button>
        </div>
        <div className={ styles[ "inputs" ] }>
          { type == "create" ? (
            <>
              <input type="text" placeholder='Team Name' className={ styles[ "name" ] } value={ teamName } onChange={ e => setTeamName( e.target.value ) } />
              <input type="text" placeholder='Team description' className={ styles[ "description" ] } value={ teamDescription } onChange={ e => setTeamDescription( e.target.value ) } />
            </>
          ) : (
            <input type="text" placeholder='Team ID' className={ styles[ "name" ] } value={ teamID } onChange={ e => {
              setTeamID( e.target.value );
              console.log( teamID );
            } } />
          ) }
        </div>
        <div className={ styles[ "buttons" ] }>
          <motion.button
            whileHover={ buttonWhileHovering( 1.1, .2 ) }
            className={ styles[ "create-button" ] }
            onClick={ type == "create" ? createTeam : joinTeam }
            disabled={ creating }
          >
            { creating ? `${ type }...` : `${ type }` }
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

export default CreateTeam;