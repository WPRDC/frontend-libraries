import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>WPRDC Topics - Home</title>
        <meta name="description" content="New WPRDC App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.titleSection}>
            <div className={styles.welcome}>
              <h1 className={styles.title}>
                Find information about your neighborhood.
              </h1>
              <div className={styles.subtitle}></div>
            </div>
          </div>
          <div className={styles.heroSection}></div>
        </div>
        <div className={styles.content}>
          <div className={styles.description}>
            This is a work in progress. Please check back often for updates.{' '}
          </div>
        </div>
        <div className={styles.menu}>
          <h2 className={styles.sectionTitle}>Apps</h2>
          <div className={styles.appsMenu}>
            <Link href="/explore">
              <div className={styles.bigButton}>
                <div className={styles.buttonTitle}>Data Explorer</div>
                <p className={styles.buttonText}>
                  Explore data and statistics about different areas in Southwest
                  PA.
                </p>
              </div>
            </Link>
            <Link href="/reach">
              <div className={styles.bigButton}>
                <div className={styles.buttonTitle}>
                  Community Data Explorer
                </div>
                <p className={styles.buttonText}>
                  Explore health data for select neighborhoods in SWPA.
                </p>
              </div>
            </Link>
            <Link href="/housing">
              <div className={styles.bigButton}>
                <div className={styles.buttonTitle}>Housing Topics</div>
                <p className={styles.buttonText}>
                  Community-level topics focused on housing.
                </p>
              </div>
            </Link>
          </div>

          <h2 className={styles.sectionTitle}>Tools</h2>
          <div className={styles.toolsMenu}>
            <a href="https://api.profiles.wprdc.org">
              <div className={styles.toolButton}>
                <div className={styles.buttonTitle}>API</div>
                <p className={styles.toolButtonText}>
                  Build or enhance your app with open civic data.
                </p>
              </div>
            </a>
            <a href="https://api.profiles.wprdc.org/tiles/index.json">
              <div className={styles.toolButton}>
                <div className={styles.buttonTitle}>Map Tile Server</div>
                <p className={styles.toolButtonText}>
                  Use our data layers in your maps or apps!
                </p>
              </div>
            </a>
            <a href="https://profiles.wprdc.org/components/">
              <div className={styles.toolButton}>
                <div className={styles.buttonTitle}>Component Library</div>
                <p className={styles.toolButtonText}>
                  UI components with connections to WPRDC data.
                </p>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
