import { getAddress } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import { useMetamaskProvider } from '../providers';
import { MetamaskError } from '../types';

export type Account = string | null;

/**
 * @description should be used in MetamaskAccountProvider only
 */
function useAccount() {
  const { isSupported, provider, metamaskProvider } = useMetamaskProvider();
  const [account, setAccount] = useState<Account>(null);
  const [balance, setBalance] = useState('');
  const [isAccountLoading, setIsAccountLoading] = useState(false);

  const updateBalance = useCallback(async () => {
    if (!(isSupported && account)) return;

    try {
      const balance = await provider.getBalance(account);

      setBalance(String(balance));
    } catch (e) {
      console.error('updateBalance error', e);
    }
  }, [isSupported, provider, account, setBalance]);

  const getAccount = useCallback(async () => {
    if (!isSupported) return null;

    setIsAccountLoading(true);

    try {
      const signers = await provider.listAccounts();
      const account = getAddress(signers[0].address) || null;

      if (account) {
        const balance = await provider.getBalance(account);

        setBalance(String(balance));
      }

      return setIsAccountLoading(false), setAccount(account), account;
    } catch (err) {
      return setIsAccountLoading(false), setAccount(null), null;
    }
  }, [provider, isSupported]);

  const connect = useCallback(
    async (onError: (error: MetamaskError) => void) => {
      if (!isSupported) return;

      setIsAccountLoading(true);

      try {
        const accounts: string[] = await provider.send('eth_requestAccounts', []);
        const account = accounts[0] ?? null;

        if (account) {
          const balance = await provider.getBalance(account);

          setBalance(String(balance));
        }

        setAccount(account);
      } catch (e) {
        onError(e as MetamaskError);
        console.error(e);
      } finally {
        setIsAccountLoading(false);
      }
    },
    [isSupported, provider]
  );

  const onDisconnect = useCallback(() => setAccount(null), []);

  const onAccountChange = useCallback(
    async (accounts: unknown) => {
      if (Array.isArray(accounts) && accounts.length) {
        const account = getAddress(accounts[0]);

        if (account && isSupported) {
          const balance = await provider.getBalance(account);

          setBalance(String(balance));
        }

        setAccount(account);
      } else {
        setAccount(null);
      }
    },
    [provider, isSupported]
  );

  useEffect(() => {
    if (isSupported) {
      metamaskProvider.on('accountsChanged', onAccountChange);
      metamaskProvider.on('disconnect', onDisconnect);
    }

    return () => {
      metamaskProvider?.off('accountsChanged', onAccountChange);
      metamaskProvider?.off('disconnect', onDisconnect);
    };
  }, [onDisconnect, onAccountChange, isSupported, metamaskProvider]);

  return {
    connect,
    getAccount,
    setAccount,
    updateBalance,
    isAccountLoading,
    account,
    balance,
  };
}

export type UseAccount = ReturnType<typeof useAccount>;

export default useAccount;
