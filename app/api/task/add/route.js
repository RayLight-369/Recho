import { getData, insertData, updateData } from "@/app/Supabase/Supabase";

export const POST = async ( req, res ) => {
  try {

    const body = await req.json();
    const currentDate = new Date();
    const created_at = `${ currentDate.getDate() }-${ currentDate.toLocaleString( 'default', { month: 'long' } ).substring( 0, 3 ) } ${ currentDate.getFullYear() }`;

    const { currentChannel, ...bulkData } = body;

    const TaskResponse = await insertData( {
      table: "Tasks",
      object: !bulkData?.bulkData?.length ? ( { created_at, ...bulkData } ) : bulkData.bulkData
    } );

    // {
    //   title: body.title,
    //     description: body.description,
    //       status: 0,
    //         priority: +body.priority,
    //           assignee: +body.assignee,
    //             reporter: +body.reporter,
    //               created_at,
    //               due_date: body.due_date;
    // }

    const prevChannelData = await getData( {
      table: "Channels",
      where: {
        id: currentChannel.id
      }
    } );

    let updatedTaskIds = prevChannelData.data[ 0 ].tasks_ids;
    updatedTaskIds.push( ...( TaskResponse.data.map( task => task.id ) ) );

    await updateData( {
      table: "Channels",
      where: {
        id: currentChannel.id,
      },
      object: {
        tasks_ids: updatedTaskIds
      }
    } );

    console.log( "body ", JSON.stringify( body, null, 2 ) );

    return new Response( JSON.stringify( { data: TaskResponse.data } ), { status: 201 } );

  } catch ( e ) {
    console.log( e );
    return new Response( JSON.stringify( { error: e } ), { status: 500 } );
  }
};