import { getData, insertData, updateData } from "@/app/Supabase/Supabase";
import { v4 as uid } from "uuid";


export const POST = async ( req, res ) => {
  try {

    const body = await req.json();
    const currentDate = new Date();
    const date = `${ currentDate.getDate() }-${ currentDate.toLocaleString( 'default', { month: 'long' } ).substring( 0, 3 ) } ${ currentDate.getFullYear() }`;
    console.log( "body ", body );
    // return;

    let TaskResponse = await insertData( {
      table: "Tasks",
      object: {
        title: "Upload a Task on Recho.",
        description: "upload a task on Recho...",
        priority: 2,
        status: 0,
        created_at: date
      }
    } );

    let channelResponse = await insertData( {
      table: "Channels",
      object: {
        name: "general",
        tasks_ids: [ TaskResponse.data[ 0 ].id ],
        created_at: date
      }
    } );

    let response = await insertData( {
      table: "Teams",
      object: {
        name: body.teamName,
        members: [ [ body.userId, body.userRole, body.userName ] ],
        channel_ids: [ [ channelResponse.data[ 0 ].id, channelResponse.data[ 0 ].name ] ],
        created_at: date,
        invite_link: `/invite/${ uid() }`
      }
    } );

    let TeamData = response.data[ 0 ];
    body.teamsData.push( { "id": TeamData.id, "team invite link": TeamData.invite_link, "teamName": TeamData.name, "role": "owner", "settings": { "color": "Light" } } );

    let userData = await updateData( {
      table: "Users",
      where: {
        email: body.userEmail
      },
      object: {
        teamsData: body.teamsData
      }
    } );

    return new Response( JSON.stringify( { data: TeamData, userData } ), { status: 201 } );

  } catch ( e ) {
    console.log( e );
    return new Response( JSON.stringify( { error: e } ), { status: 500 } );
  }
};