import Link from 'next/link';
import styles from './HousecatNavbar.module.css';

export function HousecatNavbar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.branding}>
        <div className={styles.title}>
          <Link href="/housecat">
            <a>HouseCat</a>
          </Link>
        </div>
        <div className={styles.subtitle}>
          affordable housing information catalogue
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
          <Link href="/housing" target="_blank" rel="noreferrer noopener">
            <a target="_blank" rel="noreferrer noopener">
              Indicators
            </a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="/housecat/about">
            <a>About</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
