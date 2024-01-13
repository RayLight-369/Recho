"use client";

import { useData } from '@/app/Contexts/DataContext/DataContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const page = () => {

  const router = useRouter();
  const { data } = useData();
  const [ msg, setmsg ] = useState( "fetching your data, oops i meant your Teams Data ;)" );

  useEffect( () => {
    if ( "signedIn" in data && data.signedIn ) {
      if ( data?.sessionData.teamsData.length ) {
        let firstTeam = data.sessionData.teamsData[ 0 ];
        let firstChannel = firstTeam.channels[ 0 ];
        router.replace( `/teams/${ firstTeam.teamID }/${ firstChannel.id }` );
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