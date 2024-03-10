import { memo, useEffect, useState } from 'react';
import styles from "./Header.module.css";
import { useData } from '@/app/Contexts/DataContext/DataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
// import { pusherClient } from '@/lib/pusher';
import { io } from 'socket.io-client';
import { socket } from '@/lib/socketio';


const Header = ( { className, openPopup } ) => {

  const { data, dataloading, currentTeam } = useData();
  const [ createTeamPopupOpen, setCreateTeamPopupOpen ] = useState( false );
  const [ dropDownOpen, toggleDropDown ] = useState( false );
  const router = useRouter();

  const variants = {
    open: {
      scaleY: 1,
      // height: "fit-content",
    },
    close: {
      scaleY: 0,
      // height: "0",
    }
  };

  useEffect( () => {

    const teams = data?.sessionData?.currentUserData.current_user_teams_data;
    console.log( "teams: ", teams );

    if ( teams?.length ) {
      // for ( let i = 0; i < teams.length; i++ ) {

      //   const channel = pusherClient.subscribe( `tm=${ teams[ i ].id }` );
      //   channel.bind( "member-join", function ( data ) {
      //     console.log( `member-join: `, data );
      //   } );
      //   console.log( `tm=${ teams[ i ].id }` );
      // }

      socket.emit( "newConnection", {
        id: data.user.id,
        name: data.user.name
      } );

      socket.emit( "join_teams", ( teams.map( team => ( { id: team.id, name: team.teamName } ) ) ) );

      socket.on( "client_member_join", ( data ) => {
        console.log( `new member joined : `, data.memberID );
      } );


      // socket.on( "connection", ( data ) => {
      //   console.log( "socket: ", data );
      // } );

      // teams.map( team => pusherClient.subscribe( `tm=${ team.id }` ).bind( "member-join", function ( data ) {
      //   console.log( `member-join: `, data );
      // } ) );
    }


    console.log( "currentTeam: ", currentTeam );
  }, [ data ] );

  if ( dataloading && !data ) {
    return <header className={ `${ className && className }` }>
      Loading...
    </header>;
  }

  useEffect( () => {
    const select = document.querySelector( "div#teamNames" );
    document.onclick = e => {
      if ( !select.contains( e.target ) ) toggleDropDown( false );
    };

    // const socket = io( 'http://localhost:5261' );

    socket.on( "client_member_presence", ( data ) => {
      console.log( "presence" );
      console.log( `just logged in!: `, data );
    } );

    // return () => {
    //   socket.disconnect();
    // };
  }, [] );

  const ToggleDropDown = () => toggleDropDown( prev => !prev );
  const closeDropDown = () => toggleDropDown( false );

  return (
    <header id={ styles[ "header" ] } className={ className }>
      <div className={ styles[ "teams-search" ] }>
        <div className={ styles[ "teams" ] } onClick={ ToggleDropDown }>

          <div className={ styles[ 'select' ] } name="teamNames" id="teamNames" >
            <p className={ styles[ "default-team" ] }>{ currentTeam?.teamName }</p>
          </div>

          <AnimatePresence mode='wait'>
            { dropDownOpen && (
              <motion.div className={ styles[ "other-teams" ] } variants={ variants } animate="open" initial="close" exit="close" >
                { data?.sessionData?.currentUserData.current_user_teams_data.map( ( team, i ) => (
                  <>
                    { team.id != currentTeam?.teamID && (
                      <Link key={ i } href={ `/teams/${ team.id }` } onClick={ ( e ) => {
                        closeDropDown();
                        // router.push( `/teams/${ team.id }` );
                      } }>{ team.teamName }</Link>
                    ) }
                  </>
                ) ) }

                <Link href={ "/teams/create" } key={ "create" } onClick={ ( e ) => {
                  e.preventDefault();
                  e.stopPropagation();
                  closeDropDown();
                  openPopup();
                  console.log( "opneeened" );
                } }>Create New Team</Link>
              </motion.div>
            ) }
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default memo( Header );