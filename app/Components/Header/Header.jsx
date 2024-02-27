import{memo} from 'react';
import styles from "./Header.module.css";

const Header = ( { className } ) => {
  return (
    <header className={ `${ className && className }` }>
      <div className={ styles[ "teams-search" ] }>
        <button type="button"></button>
      </div>
    </header>
  );
};

export default memo(Header);