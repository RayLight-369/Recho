export const navigateTo = ( data, { teamId, channelId, setCurrentTeam, setCurrentChannel, setCurrentTask } ) => {
  // const selectedTeam =
  const selectedTeam = teamId ? data.teamsData.find( ( team ) => team.teamID == teamId ) : data.teamsData[ 0 ];
  const selectedChannel = channelId ? selectedTeam?.channels.find( ( channel ) => channel.id == channelId ) : selectedTeam?.channels[ 0 ];

  setCurrentTeam( selectedTeam );
  setCurrentChannel( selectedChannel );

  console.log( { selectedTeam, selectedChannel } );

  return [ selectedTeam.teamID, selectedChannel.id ];
  // return { selectedTeam, selectedChannel };

};