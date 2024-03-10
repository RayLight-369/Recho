"use client";

import { useData } from '@/app/Contexts/DataContext/DataContext';
import { navigateTo } from '@/app/utils/changePage';
import { socket } from '@/lib/socketio';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const page = () => {

  const router = useRouter();
  const { data, setCurrentTeam, setCurrentChannel, setCurrentChannelTasks } = useData();
  const [ msg, setmsg ] = useState( "fetching your data, oops i meant your Teams Data ;)" );

  useEffect( () => {
    if ( "signedIn" in data && data.signedIn ) {
      socket.connect();
      if ( data?.sessionData.teamsData.length ) {

        let firstTeam = data.sessionData.teamsData[ 0 ];
        let firstChannel = firstTeam.channels[ 0 ];

        router.prefetch( `/teams/${ firstTeam.teamID }/${ firstChannel.id }` );

        const [ team, channel ] = navigateTo( data.sessionData, { teamId: firstTeam.teamID, channelId: firstChannel.id, setCurrentChannel, setCurrentTeam, setCurrentChannelTasks } );

        setmsg( "redirecting..." );

        // socket.emit( "newConnection", {
        //   id: data.user.id,
        //   name: data.user.name
        // } );

        router.push( `/teams/${ team }/${ channel }` );

      } else {
        setmsg( "redirecting..." );
        router.replace( "/teams/create" );
      }
    }
  }, [ data ] );

  return (
    <div>{ msg }</div>
  );
};

export default page;