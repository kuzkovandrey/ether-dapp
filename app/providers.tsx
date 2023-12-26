import { PropsWithChildren } from 'react';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { MetamaskAccountProvider, MetamaskProvider } from '@/metamask/providers';
import { ChainEventsProvider, ThemeProvider } from '@/providers';
import { useAppStore } from '@/store';
import { store } from '@/store/redux-store';

function Providers({ children }: PropsWithChildren) {
  const { theme } = useAppStore();

  return (
    <>
      <ThemeProvider>
        <MetamaskProvider>
          <MetamaskAccountProvider>
            <ReduxStoreProvider store={store}>
              <ChainEventsProvider>{children}</ChainEventsProvider>
            </ReduxStoreProvider>
          </MetamaskAccountProvider>
        </MetamaskProvider>
      </ThemeProvider>
      <ToastContainer position="top-right" autoClose={5000} closeOnClick theme={theme} />
    </>
  );
}

export default Providers;
