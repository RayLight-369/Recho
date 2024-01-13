"use client";

import { useData } from '@/app/Contexts/DataContext/DataContext';
import { navigateTo } from '@/app/utils/changePage';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const page = () => {

  const router = useRouter();
  const { data, setCurrentTeam, setCurrentChannel } = useData();
  const [ msg, setmsg ] = useState( "fetching your data, oops i meant your Teams Data ;)" );

  useEffect( () => {
    if ( "signedIn" in data && data.signedIn ) {
      if ( data?.sessionData.teamsData.length ) {
        let firstTeam = data.sessionData.teamsData[ 0 ];
        let firstChannel = firstTeam.channels[ 0 ];
        router.prefetch( `/teams/${ firstTeam.teamID }/${ firstChannel.id }` );
        let [ team, channel ] = navigateTo( data.sessionData, { teamId: firstTeam.teamID, channelId: firstChannel.id, setCurrentChannel, setCurrentTeam } );
        router.push( `/teams/${ team }/${ channel }` );
        setmsg( "redirecting..." );
      } else {
        router.replace( "/teams/create" );
        setmsg( "redirecting..." );
      }
    }
  }, [ data ] );

  return (
    <div>{ msg }</div>
  );
};

export default page;