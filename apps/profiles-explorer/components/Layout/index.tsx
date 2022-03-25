import { PropsWithChildren } from 'react';
import Footer from '../Footer';
import DefaultNavbar from '../Navbar';

import styles from './Layout.module.css';

export interface LayoutProps extends PropsWithChildren<{}> {
  Navbar?: React.FC<any>;
}

export default function Layout({
  Navbar = DefaultNavbar,
  children,
}: LayoutProps) {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
