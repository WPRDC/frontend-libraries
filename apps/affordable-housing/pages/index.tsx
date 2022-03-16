import type { NextPage } from 'next';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.infoTitle}>
        Find information on affordable housing
      </h2>

      <div className={styles.buttonSection}>
        <Link href="/map">
          <button className={styles.bigButton}>
            <div className={styles.buttonTitle}>Map</div>
            <div className={styles.buttonText}>
              Explore all the data on a map
            </div>
          </button>
        </Link>
        <Link href="/watchlist">
          <button className={styles.bigButton}>
            <div className={styles.buttonTitle}>Watchlist</div>
            <div className={styles.buttonText}>Limit to selected projects</div>
          </button>
        </Link>
        <Link href="/search">
          <button className={styles.bigButton}>
            <div className={styles.buttonTitle}>Search</div>
            <div className={styles.buttonText}>
              Find information on housing projects
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
