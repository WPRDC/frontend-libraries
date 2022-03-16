import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.branding}>
        <div className={styles.title}>
          <Link href="/">
            <a>Community Profiles</a>
          </Link>
        </div>
        <div className={styles.subtitle}>
          Directory of all WPRDC indicators for Southwestern PA
        </div>
      </div>
      <div className={styles.filler} />
      <div className={styles.menu}></div>
    </div>
  );
}
