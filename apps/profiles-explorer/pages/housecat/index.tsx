import Link from 'next/link';
import Layout from '../../components/Layout';
import styles from '../../styles/housecat/Home.module.css';
import { HousecatNavbar } from '../../components/Navbar';

function HousecatHome() {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.infoTitle}>
        Find information on affordable housing
      </h2>

      <div className={styles.buttonSection}>
        <Link href="/housecat/map">
          <button className={styles.bigButton}>
            <div className={styles.buttonTitle}>Map</div>
            <div className={styles.buttonText}>
              Explore all the data on a map
            </div>
          </button>
        </Link>
        <Link href="/housecat/watchlist">
          <button className={styles.bigButton}>
            <div className={styles.buttonTitle}>Watchlist</div>
            <div className={styles.buttonText}>Limit to selected projects</div>
          </button>
        </Link>
        <Link href="/housecat/search">
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
}

HousecatHome.getLayout = function getLayout(page: React.ReactChildren) {
  return <Layout Navbar={HousecatNavbar}>{page}</Layout>;
};

export default HousecatHome;
