import styles from './Footer.module.css';

export default function Footer() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spacer} />
      <div className={styles.links}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/wprdc/neighborhood-simulacrum"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
