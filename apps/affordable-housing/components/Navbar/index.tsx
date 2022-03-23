import Link from 'next/link';
import styles from './Navbar.module.css';

import { FaExternalLinkAlt } from 'react-icons/fa';

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
        <div className={styles.menuItem}>
          <a
            href="https://profiles.wprdc.org/housing"
            target="_blank"
            rel="noreferrer noopener"
          >
            Indicators
          </a>
          <FaExternalLinkAlt className={styles.extIcon} />
        </div>
      </div>
    </div>
  );
}
