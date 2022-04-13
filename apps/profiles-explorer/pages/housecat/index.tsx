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
            <div className={styles.buttonTitle}>🗺 Map</div>
            <div className={styles.buttonText}>
              Explore all the data on a map
            </div>
          </button>
        </Link>
        <Link href="/housecat/watchlist">
          <button className={styles.bigButton}>
            <div className={styles.buttonTitle}>✔️ Watchlist</div>
            <div className={styles.buttonText}>Limit to selected projects</div>
          </button>
        </Link>
        <Link href="/housecat/search">
          <button className={styles.bigButton}>
            <div className={styles.buttonTitle}>🔍 Search</div>
            <div className={styles.buttonText}>
              Find information on housing projects
            </div>
          </button>
        </Link>
      </div>
      <div className={styles.smallButtonSection}>
        <Link href="/housing">
          <button className={styles.bigButton}>
            <div className={styles.buttonTitle}>📊 Indicators</div>
            <div className={styles.buttonText}>
              Community-level housing statistics.
            </div>
          </button>
        </Link>
        <Link href="/housecat/about">
          <button className={styles.bigButton}>
            <div className={styles.buttonTitle}>📜 About</div>
            <div className={styles.buttonText}>
              Information about the data and process
            </div>
          </button>
        </Link>
      </div>
      <div className={styles.content}>
        <p>
          <strong>
            Affordable housing is a growing issue of regional importance in our
            community.
          </strong>
          {'  '}
          In May, 2016, the City of Pittsburgh&rsquo;s Affordable Housing Task
          Force released{' '}
          <a href="https://apps.pittsburghpa.gov/mayorpeduto/FinalReport_5_31_16.pdf">
            its report
          </a>{' '}
          to the Mayor and City Council. The report called for the creation of a
          centralized, publicly-accessible repository of affordable housing data
          to be hosted by the{' '}
          <a href="https://www.wprdc.org">
            Western Pennsylvania Regional Data Center
          </a>
          . In addition to including lists of deed and income-restricted
          properties, the Task Force also sought to use data to track
          compliance, monitor housing conditions, and establish an &lsquo;early
          warning system&rsquo; when use restrictions change, or condition
          issues threaten overall affordability and family stability.
        </p>
        <p>
          To support this goal of using data to proactively monitor threats to
          affordability, the Western Pennsylvania Regional Data Center at the
          University of Pittsburgh and the{' '}
          <a href="https://cmucreatelab.org/">Carnegie Mellon CREATE Lab</a>{' '}
          partnered to develop a frequently-updated collection of data about
          subsidized properties in Allegheny County from approximately 20
          different databases provided by HUD and the Pennsylvania Housing
          Finance Agency (PHFA). This tool launched in April 2022 allows people
          to view data for a project, and filter the data to display a subset of
          properties including those with low inspection scores and those that
          may have their subsidies expire in coming years. Users of the data
          explorer are also able to create watch lists of properties whose
          affordability is at risk. Properties can be viewed on a map, with data
          associated with each property displayed on screen.
        </p>
      </div>
    </div>
  );
}

HousecatHome.getLayout = function getLayout(page: React.ReactChildren) {
  return <Layout Navbar={HousecatNavbar}>{page}</Layout>;
};

export default HousecatHome;
