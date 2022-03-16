import Link from 'next/link';
import styles from './Navbar.module.css';
// import { Button } from '@wprdc/toolkit';

export default function Navbar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.branding}>
        <div className={styles.title}>
          <Link href="/">
            <a>Housecat</a>
          </Link>
        </div>
        <div className={styles.subtitle}>
          Affordable housing information portal
        </div>
      </div>
      <div className={styles.filler} />
      <div className={styles.menu}>
        <div className={styles.menuItem}>
          <Link href="/map">
            <a>Map</a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="/watchlist">
            <a>Watchlist</a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="/search">
            <a>Search</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
