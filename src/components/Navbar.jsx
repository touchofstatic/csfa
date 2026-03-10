import Export from './Export';
import Import from './Import';
import Themes from './Themes';
import styles from '../styles/navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Export />
      <Import />
      <Themes />
    </nav>
  );
}
