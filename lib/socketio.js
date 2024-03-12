const { io } = require( "socket.io-client" );

export const socket = io( process.env.NEXT_PUBLIC_REALTIME_URL, {
  autoConnect: true
} );

// socket.connect();