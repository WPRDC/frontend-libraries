import Link from 'next/link';
import styles from './Navbar.module.css';
// import { Button } from '@wprdc/toolkit';

export default function Navbar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.branding}>
        <div className={styles.title}>
          <Link href="/">
            <a>Profiles</a>
          </Link>
        </div>
        <div className={styles.subtitle}>
          neighborhood statistics at your fingertips
        </div>
      </div>
      <div className={styles.filler} />
      <div className={styles.menu}></div>
    </div>
  );
}
