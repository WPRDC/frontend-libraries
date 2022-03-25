import Link from 'next/link';
import styles from './HousecatNavbar.module.css';

export function HousecatNavbar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.branding}>
        <div className={styles.title}>
          <Link href="/housecat">
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
          <Link href="/housecat/map">
            <a>Map</a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="/housecat/watchlist">
            <a>Watchlist</a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="/housecat/search">
            <a>Search</a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="/housing">
            <a>Indicators</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
