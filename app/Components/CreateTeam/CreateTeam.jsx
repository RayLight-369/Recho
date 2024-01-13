import React, { useState } from 'react';
import styles from "./CreateTeam.module.css";
import { MotionConfig, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useData } from '@/app/Contexts/DataContext/DataContext';
import { set_data_after_creating_new_team } from '@/app/utils/setStates';


const CreateTeam = ( { handleClose } ) => {

  const router = useRouter();
  const [ teamName, setTeamName ] = useState( "" );
  const [ teamDescription, setTeamDescription ] = useState( "" );
  const { data: session, setData } = useData();

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

    if ( !teamName.trim().length ) return;

    try {

      const teamsData = session.sessionData.currentUserData.current_user_teams_data;
      console.log( "previous sessionData ", session ); //supabase mein data update karne ke baad yahan update nhi ho raha data

      const response = await fetch( "/api/team/create", {
        method: "POST",
        body: JSON.stringify( {
          teamName,
          teamDescription,
          userName: session.user.name,
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
        // setData( prev => ( { ...prev, } ) );
        set_data_after_creating_new_team( session.user.email, setData );
      }

    } catch ( e ) {
      console.log( e );
    }
  }

  return (
    <MotionConfig transition={ { type: "spring", damping: 7 } } >
      <div className={ styles[ "create-team" ] }>
        <div className={ styles[ "header" ] }>
          <p className={ styles[ "title" ] }>Create New Team</p>
          <motion.button type='button' whileHover={ buttonWhileHovering( 1.2, .2 ) } className={ styles[ 'close' ] } onClick={ handleClose }>✖</motion.button>
        </div>
        <div className={ styles[ "inputs" ] }>
          <input type="text" placeholder='Team Name' className={ styles[ "name" ] } value={ teamName } onChange={ e => setTeamName( e.target.value ) } />
          <input type="text" placeholder='Team description' className={ styles[ "description" ] } value={ teamDescription } onChange={ e => setTeamDescription( e.target.value ) } />
        </div>
        <div className={ styles[ "buttons" ] }>
          <motion.button
            whileHover={ buttonWhileHovering( 1.1, .2 ) }
            className={ styles[ "create-button" ] }
            onClick={ createTeam }
          >
            Create
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