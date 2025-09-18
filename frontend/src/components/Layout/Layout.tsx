import { Outlet } from 'react-router-dom';
import useScrollbarSize from 'react-scrollbar-size';
import { AppShell, MantineStyleProp } from '@mantine/core';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { Header } from '../Header/Header';
import styles from './Layout.module.css';

/**
 * Main application layout component that wraps the application with the header.
 * Uses Mantine's AppShell.
 */
const Layout = () => {
  const { width } = useScrollbarSize();

  // Reserve space for the scrollbar. This is to avoid jumping content when the scrollbar appears.
  const reserveScrollbarByReducingWidth: MantineStyleProp = {
    width: `calc(100vw - ${width + 0.01}px)`, // 0.01 because Edge calculates wrong and adds a horizontal scrollbar (only happens on Edge)
  };

  // Cannot use this on AppShell, as we will get a horizontal scrollbar. We use this on the header else we would get an odd looking gap.
  const reserveScrollbarWithPadding: MantineStyleProp = {
    width: `100vw`,
    paddingRight: width,
  };

  return (
    <AppShell
      padding="xl"
      header={{ height: 56 }}
      style={reserveScrollbarByReducingWidth}
      className={styles.background}
    >
      <AppShell.Header className={styles.header} style={reserveScrollbarWithPadding}>
        <Header />
      </AppShell.Header>
      <AppShell.Main className={styles.wrapper} pt={66}>
        <Breadcrumbs />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
