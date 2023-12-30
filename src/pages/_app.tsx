import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@/styles/globals.css';
import NextApp, { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import { MantineProvider, AppShell } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { getCookie } from 'cookies-next'
import Layout from './layout';
import { Store, StoreContext } from '@/helpers/state';
import { useEffect, useState } from 'react';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const [dataStore, setDataStore] = useState<Store | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const store = new Store();

      store.fetchUserInfo().then(() => {
        setDataStore(store);
      });
    }
  }, []);

  return (
    <>
      <StoreContext.Provider value={dataStore}>
        <Head>
          <title>MewTorrent</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>

        <MantineProvider
          defaultColorScheme="dark"
          theme={{
            fontFamily: 'Greycliff CF, sans-serif',
            primaryColor: 'pink',
          }}
        >
          <Notifications />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MantineProvider>
      </StoreContext.Provider>
    </>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie('mantine-color-scheme', appContext.ctx) || 'dark',
  };
};