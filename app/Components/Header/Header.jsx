import { memo, useEffect } from 'react';
import styles from "./Header.module.css";
import { useData } from '@/app/Contexts/DataContext/DataContext';

const Header = ( { className } ) => {

  const { currentTeam, dataloading } = useData();
  useEffect( () => {
    console.log( "team: ", currentTeam );
  }, [ currentTeam ] );

  if ( dataloading ) {
    return <header className={ `${ className && className }` }>
      Loading...
    </header>;
  }

  return (
    <header className={ `${ className && className }` }>
      <div className={ styles[ "teams-search" ] }>
        <button type="button"></button>
      </div>
    </header>
  );
};

export default memo( Header );