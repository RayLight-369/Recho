"use client";

import { SessionProvider } from "next-auth/react";

// const ThemeContext = createContext();

// export const useTheme = () => {
//   return useContext( ThemeContext );
// };

// const ThemeProvider = ( { children } ) => {

//   const [ darkMode, setDarkMode ] = useState();

//   useEffect( () => {
//     const storedDarkMode = JSON.parse( localStorage.getItem( "darkMode" ) );

//     if ( storedDarkMode && "darkMode" in storedDarkMode ) {
//       setDarkMode( storedDarkMode.darkMode );
//       console.log( storedDarkMode );
//     } else {
//       setDarkMode( false );
//       console.log( storedDarkMode );
//     }
//   }, [] );


//   useEffect( () => {
//     const rootStyles = getComputedStyle( document.documentElement );
//     const getProp = rootStyles.getPropertyValue.bind( rootStyles );

//     if ( darkMode != undefined && darkMode != null && typeof darkMode != "undefined" ) localStorage.setItem( "darkMode", JSON.stringify( { darkMode } ) );

//     if ( darkMode ) {

//     } else {

//     }

//   }, [ darkMode ] );

//   const toggleDarkMode = () => {
//     setDarkMode( prev => !prev );
//   };

//   return (
//     <ThemeContext.Provider value={ { darkMode, toggleDarkMode } }>{ children }</ThemeContext.Provider>
//   );
// };

// export { ThemeProvider };

export async function getUser () {
  try {
    let body = await fetch( "/api/auth/session" );
    let user = await body.json();
    if ( Object.keys( user ).length && Object.keys( user.user ).length ) {
      return { session: user, signedIn: true };
    }
    return { session: null, signedIn: false };
  } catch ( e ) {
    console.log( e );
  }
}

const Provider = ( { children, session } ) => {
  return (
    <SessionProvider session={ session }>
      { children }
    </SessionProvider>
  );
};

export default Provider;