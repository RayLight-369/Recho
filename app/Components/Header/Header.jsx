import { memo, useEffect, useState } from 'react';
import styles from "./Header.module.css";
import { useData } from '@/app/Contexts/DataContext/DataContext';
import { useRouter } from 'next/navigation';

const Header = ( { className, openPopup } ) => {

  const { data, dataloading, currentTeam } = useData();
  const [ createTeamPopupOpen, setCreateTeamPopupOpen ] = useState( false );
  const router = useRouter();

  useEffect( () => {
    console.log( "teams: ", data?.sessionData?.currentUserData.current_user_teams_data );
    console.log( "currentTeam: ", currentTeam );
  }, [ data ] );

  if ( dataloading ) {
    return <header className={ `${ className && className }` }>
      Loading...
    </header>;
  }

  return (
    <header id={ styles[ "header" ] } className={ className }>
      <div className={ styles[ "teams-search" ] }>
        <div className={ styles[ "teams" ] }>

          <select name="teamNames" id="teamNames" onChange={ ( e ) => {
            const option = e.target.selectedOptions[ 0 ].value;
            if ( option == "/teams/create" ) {
              openPopup();
              console.log( "opneeened" );
            } else {
              router.push( option );
            }
          } } >

            { data?.sessionData?.currentUserData.current_user_teams_data.map( ( team, i ) => (
              <option value={ `/teams/${ team.id }` } key={ i } selected={ currentTeam?.teamID == team.id }>{ team.teamName }</option>
            ) ) }

            <option value={ "/teams/create" } key={ "create" }>Create New Team</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default memo( Header );