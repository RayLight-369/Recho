"use client";
import { getUser } from '@/Provider/Provider';
import { getTeamsData } from '@/app/Supabase/Supabase';
// import { getTeamsData } from '@/app/Supabase/Supabase';
import { createContext, useContext, useEffect, useState } from 'react';

const DataContext = createContext( {} );

export const useData = () => {
  return useContext( DataContext );
};


const DataProvider = ( { children } ) => {

  const [ data, setData ] = useState( {} );
  const [ dataloading, setDataLoading ] = useState( true );

  useEffect( () => {

    async function fetchData () {
      let session = await getUser();
      let Data = session.session;
      setData( { ...Data, signedIn: session.signedIn } );
      setDataLoading( false );
    }

    fetchData();

  }, [] );

  return (
    <DataContext.Provider value={ { data, setData, dataloading } }>{ children }</DataContext.Provider>
  );
};

export default DataProvider;