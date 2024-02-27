"use client";

import { useData } from '@/app/Contexts/DataContext/DataContext';
import { setCurrentTeamChannel } from '@/app/utils/setStates';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Styles from "./page.module.css";

const page = ( { params } ) => {

  const { setCurrentTeam, setCurrentChannel, data, currentChannel, currentTeam, dataloading } = useData();
  const router = useRouter();

  useEffect( () => {
    console.log( data );
    if ( "signedIn" in data && data.signedIn ) {
      setCurrentTeamChannel( {
        teamId: params.teamId,
        channelId: params.channelId,
        setCurrentChannel,
        setCurrentTeam,
        sessionData: data.sessionData
      } );
    }
  }, [ data ] );

  if ( dataloading ) {
    return <p>Loading...</p>;
  }

  return (
    <div className={ Styles[ "channel-container" ] }>
      <div className={ Styles[ "channel-intro" ] }>
        <div className={ Styles[ "name-date" ] }>
          <p className={ Styles[ "name" ] }>
            { currentChannel?.name }
          </p>
          <p className={ Styles[ "date" ] }>
            { currentChannel?.created_at }
          </p>
        </div>
        <div className={ Styles[ "buttons" ] }>
          <button type="button">Add Member</button>
          <button type="button">Add Task</button>
        </div>
      </div>
    </div>
  );
};

export default page;