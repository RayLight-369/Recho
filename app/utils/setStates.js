import { getTeamsData } from "../Supabase/Supabase";

export const set_data_after_creating_new_team = async ( email, setData, loading ) => {
  const sessionData = await getTeamsData( { email } );
  setData( prev => ( { ...prev, sessionData } ) );
};