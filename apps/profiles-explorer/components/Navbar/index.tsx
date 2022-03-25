import Link from 'next/link';
import styles from './Navbar.module.css';

export * from './HousecatNavbar';

export interface NavbarProps {
  color?: string;
  textColor?: string;
  title?: string;
  subtitle?: string;
  titleLink?: string;
}

export default function DefaultNavbar({
  color = '#075985FF',
  textColor = '#FFFFFF',
  title = 'Community Profiles',
  subtitle = 'Directory of all WPRDC indicators for Southwestern PA',
  titleLink = '/',
}: NavbarProps): JSX.Element {
  return (
    <div
      className={styles.wrapper}
      style={{ background: color, color: textColor }}
    >
      <div className={styles.branding}>
        <div className={styles.title}>
          <Link href={titleLink}>
            <a>{title}</a>
          </Link>
        </div>
        <div className={styles.subtitle}>{subtitle}</div>
      </div>
      <div className={styles.filler} />
      <div className={styles.menu}></div>
    </div>
  );
}
