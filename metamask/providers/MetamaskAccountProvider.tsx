import { createContext, PropsWithChildren, useCallback, useContext, useEffect } from 'react';

import { useAccount, useChain } from '../hooks';
import { UseAccount } from '../hooks/useAccount';
import { UseChain } from '../hooks/useChain';
import { useMetamaskProvider } from './MetamaskProvider';

type ContextValues = Pick<UseAccount, 'isAccountLoading' | 'connect' | 'balance' | 'updateBalance'> &
  Pick<UseChain, 'chainId' | 'isSupportedChain'> &
  (
    | {
        isConnected: false;
        account?: undefined;
      }
    | {
        isConnected: true;
        account: string;
      }
  );

const MetamaskAccountContext = createContext<ContextValues>({
  isConnected: false,
  isAccountLoading: false,
  chainId: null,
  isSupportedChain: false,
  balance: '',
  connect: async () => undefined,
  updateBalance: async () => undefined,
});

function MetamaskAccountProvider({ children }: PropsWithChildren) {
  const { isSupported, isReady } = useMetamaskProvider();
  const { account, balance, isAccountLoading, connect, getAccount, updateBalance } = useAccount();
  const { getChainId, chainId, isSupportedChain } = useChain();

  const init = useCallback(async () => {
    await getAccount();
    await getChainId();
  }, [getAccount, getChainId]);

  useEffect(() => {
    if (isSupported && isReady) {
      init();
    }
  }, [init, isSupported, isReady]);

  useEffect(() => {
    updateBalance();
  }, [chainId, updateBalance]);

  return (
    <MetamaskAccountContext.Provider
      value={{
        ...(account ? { account, isConnected: true } : { isConnected: false }),
        chainId,
        isSupportedChain,
        isAccountLoading,
        connect,
        updateBalance,
        balance,
      }}
    >
      {children}
    </MetamaskAccountContext.Provider>
  );
}

export function useMetamaskAccountProvider(): ContextValues {
  const context = useContext(MetamaskAccountContext);

  if (context === undefined) {
    throw new Error('useMetamaskProvider must be used within a MetamaskProvider');
  }

  return context;
}

export default MetamaskAccountProvider;
