import { getData, insertData, updateData } from "@/app/Supabase/Supabase";

export const POST = async ( req, res ) => {
  try {

    const body = await req.json();
    const currentDate = new Date();
    // const date = `${ currentDate.getDate() }-${ currentDate.toLocaleString( 'default', { month: 'long' } ).substring( 0, 3 ) } ${ currentDate.getFullYear() }`;
    console.log( "body ", body );
    // return;

    const prevTeamsData = await getData( {
      table: "Teams",
      where: {
        id: body.teamID
      }
    } );

    if ( prevTeamsData.data.length ) {

      console.log( prevTeamsData.data );

      // return;
      const updatedMembers = prevTeamsData.data[ 0 ]?.members;
      updatedMembers.push( [ body.userId, "member", body.userName ] );

      const response = await updateData( {
        table: "Teams",
        where: {
          id: body.teamID
        },
        object: {
          members: updatedMembers,
        }
      } );

      console.log( "response: ", response );

      const TeamData = response[ 0 ];
      body.teamsData.push( { "id": TeamData.id, "teamName": TeamData.name, "role": "member", "settings": { "color": "Light" } } );

      const userData = await updateData( {
        table: "Users",
        where: {
          email: body.userEmail
        },
        object: {
          teamsData: body.teamsData
        }
      } );

      return new Response( JSON.stringify( { data: TeamData, userData } ), { status: 201 } );

    }

    return new Response( JSON.stringify( { error: "Team Not Found" } ), { status: 404 } );
  } catch ( e ) {
    console.log( e );
    return new Response( JSON.stringify( { error: e } ), { status: 500 } );
  }
};