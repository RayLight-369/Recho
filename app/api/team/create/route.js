import { getData, insertData, updateTeamsData } from "@/app/Supabase/Supabase";

export const POST = async ( req, res ) => {
  try {

    const body = await req.json();
    const currentDate = new Date();
    console.log( "body ", body );
    // return;

    let channelResponse = await insertData( {
      table: "Channels",
      object: {
        name: "general"
      }
    } );

    let response = await insertData( {
      table: "Teams",
      object: {
        name: body.teamName,
        members: [ [ body.userName, body.userRole ] ],
        channel_ids: [ [ channelResponse.data[ 0 ].id, channelResponse.data[ 0 ].name ] ],
        created_at: `${ currentDate.getDate() }-${ currentDate.toLocaleString( 'default', { month: 'long' } ).substring( 0, 3 ) } ${ currentDate.getFullYear() }`,
      }
    } );

    let TeamData = response.data[ 0 ];
    body.teamsData.push( { "id": TeamData.id, "role": "owner", "settings": { "color": "Light" } } );

    let userData = await updateTeamsData( {
      table: "Users",
      where: {
        email: body?.userEmail
      },
      object: {
        teamsData: body.teamsData
      }
    } ).then( console.log );

    return new Response( JSON.stringify( { data: TeamData, userData } ), { status: 201 } );

  } catch ( e ) {
    console.log( e );
    return new Response( JSON.stringify( { error: e } ), { status: 500 } );
  }
};