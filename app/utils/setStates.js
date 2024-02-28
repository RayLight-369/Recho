import { getTeamsData } from "../Supabase/Supabase";

export const set_data_after_creating_new_team = async ( email, setData, updatedData ) => {
  const sessionData = await getTeamsData( { email } );
  setData( prev => ( { ...prev, sessionData } ) );
  return { updatedData, sessionData };
};

export const setCurrentTeamChannel = ( { teamId, channelId, sessionData, setCurrentTeam, setCurrentChannel } ) => {
  // console.log( 1 );
  try {
    const selectedTeam = sessionData?.teamsData.find( ( team ) => team.teamID == teamId ) || sessionData?.teamsData[ 0 ];
    const selectedChannel = selectedTeam?.channels.find( ( channel ) => channel.id == channelId ) || selectedTeam.channels[ 0 ];

    if ( selectedTeam ) {
      setCurrentTeam( selectedTeam );
      console.log( "selected team: ", selectedTeam );
    }

    if ( selectedChannel ) {
      setCurrentChannel( selectedChannel );
    }

    return [ selectedTeam.teamID, selectedChannel.id ];

  } catch ( e ) {
    console.log( e );
  }
};