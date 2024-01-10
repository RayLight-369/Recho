"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext( ThemeContext );
};

const ThemeProvider = ( { children } ) => {

  const [ darkMode, setDarkMode ] = useState();

  useEffect( () => {
    const storedDarkMode = JSON.parse( localStorage.getItem( "darkMode" ) );

    if ( storedDarkMode && "darkMode" in storedDarkMode ) {
      setDarkMode( storedDarkMode.darkMode );
      console.log( storedDarkMode );
    } else {
      setDarkMode( false );
      console.log( storedDarkMode );
    }
  }, [] );


  useEffect( () => {
    const rootStyles = getComputedStyle( document.documentElement );
    const getProp = rootStyles.getPropertyValue.bind( rootStyles );

    if ( darkMode != undefined && darkMode != null && typeof darkMode != "undefined" ) localStorage.setItem( "darkMode", JSON.stringify( { darkMode } ) );

    if ( darkMode ) {

    } else {

    }

  }, [ darkMode ] );

  const toggleDarkMode = () => {
    setDarkMode( prev => !prev );
  };

  return (
    <ThemeContext.Provider value={ { darkMode, toggleDarkMode } }>{ children }</ThemeContext.Provider>
  );
};

export default ThemeProvider;