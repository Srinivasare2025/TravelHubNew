import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemedRoot } from '../../../../shared/components';
import { Header } from './Header';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import styles from './Layout.module.scss';

/** The header/nav/footer shell every route renders inside of (react-router's <Outlet/> is the page). */
export const Layout: React.FC = () => (
  <ThemedRoot className={styles.shell}>
    <Header />
    <TopNav />
    <main className={styles.main}>
      <Outlet />
    </main>
    <Footer />
  </ThemedRoot>
);
