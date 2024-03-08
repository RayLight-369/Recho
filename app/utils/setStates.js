import { getTeamsData } from "../Supabase/Supabase";

export const set_data_after_creating = async ( email, setData, updatedData ) => {
  const sessionData = await getTeamsData( { email } );
  setData( prev => ( { ...prev, sessionData } ) );
  return { updatedData, sessionData };
};

export const setCurrentSessionTasks = ( { currentChannel, setCurrentChannel, currentChannelTasks, setCurrentChannelTasks } ) => {
  try {
    console.log( "currentChannel:", currentChannel );
    console.log( "currentChannelTasks:", currentChannelTasks );
  } catch ( e ) {
    console.log( e );
  }
};

export const setCurrentTeamChannel = ( { teamId, channelId, sessionData, setCurrentTeam, setCurrentChannel, setCurrentChannelTasks } ) => {
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
      if ( setCurrentChannelTasks ) setCurrentChannelTasks( selectedChannel.tasks );
      console.log( "selected channel: ", selectedChannel );
    }

    return [ selectedTeam.teamID, selectedChannel.id ];

  } catch ( e ) {
    console.log( e );
  }
};