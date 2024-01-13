import { getTeamsData } from "../Supabase/Supabase";

export const set_data_after_creating_new_team = async ( email, setData, updatedData ) => {
  const sessionData = await getTeamsData( { email } );
  setData( prev => ( { ...prev, sessionData } ) );
  return { updatedData, sessionData };
};

export const setCurrentTeamChannel = async ( { teamId, channelId, sessionData, setCurrentTeam, setCurrentChannel } ) => {
  console.log( 1 );
  try {
    const selectedTeam = sessionData?.teamsData.find( ( team ) => team.teamID == teamId );
    const selectedChannel = selectedTeam?.channels.find( ( channel ) => channel.id == channelId );

    if ( selectedTeam ) {
      setCurrentTeam( selectedTeam );
      console.log( "selected team: ", selectedTeam );
    } else {
      throw new Error( "User not part of this team" );
    }

    if ( selectedChannel ) {
      setCurrentChannel( selectedChannel );
    } else {
      setCurrentChannel( selectedTeam.channels[ 0 ] );
    }

  } catch ( e ) {
    console.log( e );
  }
};