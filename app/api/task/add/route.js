import { getData, insertData, updateData } from "@/app/Supabase/Supabase";

export const POST = async ( req, res ) => {
  try {

    const body = await req.json();
    const currentDate = new Date();
    console.log( "body ", JSON.stringify( body, null, 2 ) );

  } catch ( e ) {
    console.log( e );
    return new Response( JSON.stringify( { error: e } ), { status: 500 } );
  }
};