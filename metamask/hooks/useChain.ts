import { useCallback, useEffect, useMemo, useState } from 'react';

import { supportedNetworks } from '@/shared';
import { useAppStore } from '@/store';

import { useMetamaskProvider } from '../providers';

/**
 * @description should be used in MetamaskAccountProvider only
 */
function useChain() {
  const { isSupported, provider, metamaskProvider } = useMetamaskProvider();
  const [chainId, setChainId] = useState<number | null>(null);
  const { setActiveNetwork } = useAppStore();

  const isSupportedChain = useMemo(
    () => Boolean(supportedNetworks.find(({ chainId: id }) => chainId === id)),
    [chainId]
  );

  const getChainId = useCallback(async () => {
    if (!isSupported) return;

    try {
      const result = await provider.getNetwork();

      const id = Number(result.chainId);

      setActiveNetwork(supportedNetworks.find(({ chainId }) => chainId === id));
      setChainId(id);
    } catch (error) {
      console.error('getChainId error', error);

      setChainId(null);
      setActiveNetwork(null);
    }
  }, [setActiveNetwork, isSupported, provider]);

  const onChainChange = useCallback(
    (chainId: unknown) => {
      if (typeof chainId !== 'string') {
        setChainId(null);
      } else {
        const id = parseInt(chainId, 16);
        const _id = Number.isNaN(id) ? null : id;

        setActiveNetwork(supportedNetworks.find(({ chainId }) => _id === chainId));
        setChainId(_id);
      }
    },
    [setActiveNetwork]
  );

  useEffect(() => {
    if (isSupported) {
      metamaskProvider.on('chainChanged', onChainChange);
    }
    return () => {
      metamaskProvider?.off('chainChanged', onChainChange);
    };
  }, [isSupported, metamaskProvider, onChainChange]);

  return { chainId, getChainId, isSupportedChain };
}

export type UseChain = ReturnType<typeof useChain>;

export default useChain;
