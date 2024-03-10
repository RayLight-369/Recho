import { exists, getData, getTeamsData, insertData } from "@/app/Supabase/Supabase";
import { socket } from "@/lib/socketio";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// import io from 'socket.io-client';
// const socket = io( 'http://localhost:5261' );

const handler = NextAuth( {

  providers: [

    GoogleProvider( {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    } )

  ],
  callbacks: {

    async session ( { session, user, token } ) {

      // const sessionUser = await getData( {
      //   table: "users",
      //   where: {
      //     email: session.user.email
      //   }

      // } ).then( users => users.data[ 0 ] );

      // session.user.id = sessionUser.id;
      // session.user.role = sessionUser.role;

      const sessionData = await getTeamsData( {
        email: session.user.email
      } );

      const id = sessionData.currentUserData.id;

      session = { ...session, user: { ...session.user, id }, sessionData };

      // socket.emit( "newConnection", {
      //   id,
      //   name: session.user.name
      // } );

      return session;

    },
    async signIn ( { profile } ) {

      try {

        const userExist = await exists( {
          table: "Users",
          where: {
            email: profile.email
          },
          columns: "email"
        } );

        if ( !userExist ) {

          const currentDate = new Date();

          await insertData( {
            table: "Users",
            object: {
              email: profile.email,
              name: profile.name.toLowerCase(),
              image: profile.picture,
              created_at: `${ currentDate.getDate() }-${ currentDate.toLocaleString( 'default', { month: 'long' } ).substring( 0, 3 ) } ${ currentDate.getFullYear() }`,
              teamsData: []
            }
          } );

        }

        return true;

      } catch ( e ) {

        console.log( e );
        return false;

      }

    }
  }
} );

export { handler as GET, handler as POST };