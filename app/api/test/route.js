export const POST = async ( req, res ) => {
  const data = await req.json();
  console.log( data );
  if ( data ) {
    return new Response( JSON.stringify( { text: "ok" } ), { status: 200 } );
  }
};