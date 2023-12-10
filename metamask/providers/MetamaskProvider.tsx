import detectEthereumProvider from '@metamask/detect-provider';
import { BrowserProvider, Eip1193Provider } from 'ethers';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';

import { useEffectOnce } from '@/hooks';

interface Listener {
  (...args: unknown[]): void;
}

interface MetaMaskEthereumProvider {
  isMetaMask?: boolean;
  once(eventName: string | symbol, listener: Listener): this;
  on(eventName: string | symbol, listener: Listener): this;
  off(eventName: string | symbol, listener: Listener): this;
  addListener(eventName: string | symbol, listener: Listener): this;
  removeListener(eventName: string | symbol, listener: Listener): this;
  removeAllListeners(event?: string | symbol): this;
}

type ContextValue =
  | {
      isSupported: true;
      isReady: boolean;
      metamaskProvider: MetaMaskEthereumProvider;
      provider: BrowserProvider;
    }
  | {
      isSupported: false;
      isReady: boolean;
      metamaskProvider: null;
      provider: null;
    };

const initialContextValue: ContextValue = {
  isSupported: false,
  isReady: false,
  metamaskProvider: null,
  provider: null,
};

const MetamaskContext = createContext<ContextValue>({
  isSupported: false,
  isReady: false,
  metamaskProvider: null,
  provider: null,
});

function MetamaskProvider({ children }: PropsWithChildren) {
  const [contextValue, setContextValue] = useState<ContextValue>(initialContextValue);

  const init = useCallback(async () => {
    try {
      const metamaskProvider = await detectEthereumProvider<MetaMaskEthereumProvider>({ mustBeMetaMask: true });

      if (metamaskProvider && (metamaskProvider as unknown as Eip1193Provider) === window.ethereum) {
        const provider = new BrowserProvider(metamaskProvider as unknown as Eip1193Provider);

        setContextValue({
          isReady: true,
          isSupported: true,
          metamaskProvider: metamaskProvider,
          provider,
        });
      } else {
        throw new Error('Metamask not supported');
      }
    } catch (err) {
      setContextValue({
        isReady: true,
        isSupported: false,
        metamaskProvider: null,
        provider: null,
      });

      console.error(err);
    }
  }, []);

  useEffectOnce(() => {
    init();
  });

  const { isSupported, metamaskProvider } = contextValue;

  useEffect(() => {
    const onChainChange = () => {
      const provider = new BrowserProvider(metamaskProvider as unknown as Eip1193Provider);

      setContextValue((values) => (values.isSupported ? { ...values, provider } : values));
    };

    if (isSupported) {
      metamaskProvider.on('chainChanged', onChainChange);
    }
    return () => {
      metamaskProvider?.off('chainChanged', onChainChange);
    };
  }, [isSupported, metamaskProvider]);

  return <MetamaskContext.Provider value={contextValue}>{children}</MetamaskContext.Provider>;
}

export function useMetamaskProvider(): ContextValue {
  const context = useContext(MetamaskContext);

  if (context === undefined) {
    throw new Error('useMetamaskProvider must be used within a MetamaskProvider');
  }

  return context;
}

export default MetamaskProvider;
