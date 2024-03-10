import { getTeamsData } from "../Supabase/Supabase";

export const set_data_after_creating = async ( email, setData, updatedData ) => {
  const sessionData = await getTeamsData( { email } );
  setData( prev => ( { ...prev, sessionData } ) );
  return { updatedData, sessionData };
};

export const set_channel_data_after_new_channel = async ( { newChannelData, teamID, setData, data, setCurrentTeam, currentTeam } ) => {
  const team = data.sessionData.teamsData.find( team => team.teamID == teamID );
  console.log( `teamhehehehe: `, team );
  console.log( `datahehehe: `, data.sessionData.teamsData );
  team.channels.push( newChannelData );

  const sessionData = {
    ...data.sessionData,
    teamsData: [
      ...data.sessionData.teamsData,
      team
    ]
  };

  setData( prev => ( {
    ...prev,
    sessionData
  } ) );

  delete newChannelData.tasks_ids;

  const formattedChannel = newChannelData;

  formattedChannel.tasks = {
    "id": 104,
    "title": "Upload a Task on Recho.",
    "description": "upload a task on Recho...",
    "status": 0,
    "priority": "2",
    "reporter": 2,
    "assignee": 1,
    "created_at": "8-Mar 2024",
    "due_date": "Any"
  };

  setCurrentTeam( prev => ( {
    ...prev,
    channels: [
      ...prev.channels,
      formattedChannel
    ]
  } ) );


  //   : {
  //       ...prev.sessionData,
  //     teamsData: [
  //       ...prev.sessionData.teamsData,
  //       team
  //     ];
  // }

  return { sessionData };
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