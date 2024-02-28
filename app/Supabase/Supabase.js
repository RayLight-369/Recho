import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient( supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
} );



export const getData = async ( {
  table,
  range,
  columns = [],
  where = {},
  contains = {},
  orderBy = {
    property: 'id',
    ascending: false
  }
} ) => {

  try {

    if ( Array.isArray( columns ) ) {
      columns = columns.join( "," );
    }

    let Data = supabase
      .from( table )
      .select( columns, { count: "exact" } )
      .match( where )
      .order( orderBy.property, { ascending: orderBy.ascending } );

    if ( range && range.length === 2 ) {
      Data.range( range[ 0 ], range[ 1 ] );
    }

    if ( Object.keys( contains ).length ) {
      for ( let key in contains ) {
        Data.ilike( key, `%${ contains[ key ].join( "%" ) }%` );
      }
    }

    let { data, error, statusText, count } = await Data;

    return { data, statusText, error, remaining: count - ( data ? data.length : 0 ) };

  } catch ( error ) {

    console.log( error );

  }

  return false;

};

export const insertData = async ( {
  table,
  object
} ) => {

  try {

    const { data, error, statusText } = await supabase
      .from( table )
      .insert( object )
      .select();

    return { data, error, statusText };

  } catch ( error ) {

    console.log( error );

  }

  return false;

};

export const updateData = async ( {
  table,
  object,
  where
} ) => {

  try {

    let Data = await supabase
      .from( table )
      .update( object )
      .match( where )
      .select();


    return Data.data;

  } catch ( error ) {

    console.log( error );

  }

  return false;

};

// export const updateTeamsData = async ( {
//   table,
//   object,
//   where
// } ) => {

//   try {

//     const { data, error } = await supabase
//       .from( table )
//       .update( object )
//       .match( where )
//       .select();

//     if ( data && data.length ) return data;
//     if ( error ) console.log( error );

//     return false;

//   } catch ( error ) {

//     console.log( error );
//     return false;

//   }

// };

export const exists = async ( {
  table,
  where,
  columns = []
} ) => {
  try {

    if ( Array.isArray( columns ) ) {
      columns = columns.join( "," );
    }

    let { data, error } = await supabase
      .from( table )
      .select( columns )
      .match( where );

    return !!data?.length;

  } catch ( e ) {
    console.log( e );
  }

  return false;
};

// export const search = async ( { table, columns, query, filter, range, orderBy = {
//   property: 'id',
//   ascending: false
// } } ) => {

//   try {

//     let formattedQuery = query.split( ' ' ).join( "%" );

//     let formattedString = columns.map( col => `${ col }.ilike.%${ formattedQuery }%` ).join( ", " );

//     const Data = supabase.
//       from( table )
//       .select()
//       .or( formattedString )
//       .order( orderBy.property, { ascending: orderBy.ascending } );

//     if ( range && range.length == 2 ) {
//       Data.range( range[ 0 ], range[ 1 ] );
//     }

//     const { data, error } = await Data;

//     if ( filter && filter != "relevance" ) {
//       return data;
//     }

//     const resultArray = data.map( item => {

//       let formattedArray = query.split( " " );

//       const titleScore = item.title.toLowerCase().replaceAll( "\n", " " ).split( " " ).filter( value => formattedArray.includes( value ) ).length * 3;
//       const descriptionScore = item.description.toLowerCase().replaceAll( "\n", " " ).split( " " ).filter( value => formattedArray.includes( value ) ).length * 2;
//       const tagsScore = item.tags.replaceAll( "#", "" ).split( " " ).filter( value => formattedArray.includes( value ) ).length;

//       const score = titleScore + descriptionScore + tagsScore;

//       return {
//         ...item,
//         score,
//       };
//     } ).sort( ( a, b ) => b.score - a.score );

//     if ( resultArray.length ) {
//       return resultArray;
//     }

//   } catch ( e ) {

//     console.log( e );

//   }

// };

export const deleteData = async ( {
  table,
  where,
} ) => {
  try {
    const { data, error, statusText } = await supabase
      .from( table )
      .delete()
      .match( where );

    return { data, error, statusText };
  } catch ( e ) {
    console.log( e );
  }

  return false;
};

export const uploadFile = async ( userID, postID, id, file ) => {

  try {

    supabase.storage
      .from( "images" )
      .upload( `users/${ userID }/${ postID }/${ id }`, file, {
        cacheControl: '3600',
        upsert: false
      } ).then( console.log );

  } catch ( e ) {

    console.log( e );

  }

};

export const getFile = ( FolderPath, id ) => {

  let { data: { publicUrl: src } } = supabase.storage.from( `images/${ FolderPath }` ).getPublicUrl( id );

  return src;

};

export const deleteFile = async ( path ) => {

  let { data } = await supabase.storage.from( `images` ).remove( [ `${ path }` ] );

  return data;

};

export const deleteAllFiles = async ( FolderPath ) => {
  let { data: list } = await supabase.storage.from( `images` ).list( FolderPath );
  const filesToDelete = list.map( file => `${ FolderPath }/${ file.name }` );
  const { data, error } = await supabase.storage.from( "images" ).remove( filesToDelete );
  return data;
};

export async function getTeamsData ( { email } ) {

  try {
    const userData = await supabase
      .from( "Users" )
      .select()
      .eq( "email", email )
      .single();

    if ( userData.data ) {

      const { teamsData: userTeamsData } = userData.data;// id, name, email, image,

      const teamPromises = userTeamsData.map( async ( team ) => {
        const teamData = await supabase
          .from( "Teams" )
          .select( "id, name, members, channel_ids, settings" )
          .eq( "id", team.id )
          .single();

        const { id: teamID, name: teamName, members, settings: teamSettings, channel_ids, created_at } = teamData.data;

        const membersData = members.map( ( [ memberId, memberRole, memberName ] ) => ( {
          id: memberId,
          role: memberRole,
          name: memberName,
        } ) );

        const channelsData = await supabase
          .from( "Channels" )
          .select()
          .in( "id", channel_ids.map( ( [ id, _ ] ) => id ) )
          .then( async ( channelsData ) => {

            let this_channel_data = channelsData.data;
            let tasks_data = this_channel_data.map( async ( channel ) => {

              if ( channel?.tasks_ids?.length ) {

                let Tasks = await supabase
                  .from( "Tasks" )
                  .select()
                  .in( "id", channel.tasks_ids.map( task => parseInt( task ) ) );

                channel.tasks = Tasks.data;
                delete channel.tasks_ids;

              }

              return channel;

            } );

            return await Promise.all( tasks_data );
          } );

        const teamChannels = channelsData;

        return {
          teamID,
          created_at,
          teamName,
          members: membersData,
          userSettings: team.settings,
          teamSettings,
          channels: teamChannels,
        };
      } );

      const teamsData = await Promise.all( teamPromises );

      return {
        teamsData, currentUserData: {
          current_user_teams_data: userTeamsData //id, name, email, image, 
        }
      };
    }

    return null;

  } catch ( error ) {
    console.error( error );
  }
}
