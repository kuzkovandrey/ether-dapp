import { PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';

import { MetamaskAccountProvider, MetamaskProvider } from '@/metamask/providers';
import { ChainEventsProvider, ThemeProvider } from '@/providers';
import { useAppStore } from '@/store';

function Providers({ children }: PropsWithChildren) {
  const { theme } = useAppStore();

  return (
    <>
      <ThemeProvider>
        <MetamaskProvider>
          <MetamaskAccountProvider>
            <ChainEventsProvider>{children}</ChainEventsProvider>
          </MetamaskAccountProvider>
        </MetamaskProvider>
      </ThemeProvider>
      <ToastContainer position="top-right" autoClose={5000} closeOnClick theme={theme} />
    </>
  );
}

export default Providers;
