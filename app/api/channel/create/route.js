import { getData, insertData, updateData } from "@/app/Supabase/Supabase";
// import { pusherServer } from "@/lib/pusher";

export const POST = async ( req, res ) => {
  try {

    const body = await req.json();
    const currentDate = new Date();
    console.log( "body ", JSON.stringify( body, null, 2 ) );
    const date = `${ currentDate.getDate() }-${ currentDate.toLocaleString( 'default', { month: 'long' } ).substring( 0, 3 ) } ${ currentDate.getFullYear() }`;

    // let TaskResponse = await insertData( {
    //   table: "Tasks",
    //   object: {
    //     title: "Upload a Task on Recho.",
    //     description: "upload a task on Recho...",
    //     status: 0,
    //     priority: 2,
    //     due_date: date,
    //     created_at: date,
    //     assignee: 1,
    //     reporter: 1
    //   }
    // } );

    let channelResponse = await insertData( {
      table: "Channels",
      object: {
        name: body.channelName,
        tasks_ids: [ "104" ],
        created_at: `${ currentDate.getDate() }-${ currentDate.toLocaleString( 'default', { month: 'long' } ).substring( 0, 3 ) } ${ currentDate.getFullYear() }`
      }
    } );

    let prevTeamRes = await getData( {
      table: "Teams",
      where: {
        id: body.currentTeam.teamID
      }
    } );

    let updatedChannelIds = prevTeamRes.data[ 0 ].channel_ids;
    updatedChannelIds.push( [ channelResponse.data[ 0 ].id.toString(), channelResponse.data[ 0 ].name ] );

    // console.log( "teams data prev: ", JSON.stringify( prevTeamRes.data, null, 2 ) );

    await updateData( {
      table: "Teams",
      where: {
        id: body.currentTeam.teamID
      },
      object: {
        channel_ids: updatedChannelIds
      }
    } );

    // pusherServer.trigger( `tm=${ prevTeamRes.data[ 0 ].id }`, "channel-create", {
    //   message: "A new channel found!",
    //   data: {
    //     teamID: body.currentTeam.teamID,
    //     channelID: body.channelID
    //   }
    // } );


    // return new Response( JSON.stringify( { msg: "wait" } ), { status: 200 } );
    return new Response( JSON.stringify( { channelData: channelResponse.data[ 0 ] } ), { status: 201 } );

  } catch ( e ) {
    console.log( e );
    return new Response( JSON.stringify( { error: e } ), { status: 500 } );
  }
};