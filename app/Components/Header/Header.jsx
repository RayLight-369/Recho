import { memo, useEffect, useState } from 'react';
import styles from "./Header.module.css";
import { useData } from '@/app/Contexts/DataContext/DataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

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
    console.log( "teams: ", data?.sessionData?.currentUserData.current_user_teams_data );
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