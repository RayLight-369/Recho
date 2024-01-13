"use client";

import { useData } from '@/app/Contexts/DataContext/DataContext';
import { setCurrentTeamChannel } from '@/app/utils/setStates';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const page = ( { params } ) => {

  const { setCurrentTeam, setCurrentChannel, data } = useData();
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

  return (
    <div>Welcome To Channel. Currently in Progress</div>
  );
};

export default page;