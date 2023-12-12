import { PropsWithChildren, useEffect } from 'react';

import { DEFAULT_BLOCKS, DEFAULT_PERCENTAGE, getGasPriorityFee, getProvider } from '@/helpers';
import { initialGasProirityState, mapBlockToStore, useAppStore, useBlockStore, useGasProrityStore } from '@/store';

function ChainEventsProvider({ children }: PropsWithChildren) {
  const { activeNetwork } = useAppStore();
  const { append, update, setLoading } = useBlockStore();
  const { setGasPriorityFee, setLoading: setLoadingGasPrority } = useGasProrityStore();

  useEffect(() => {
    if (!activeNetwork) return;

    const provider = getProvider(activeNetwork.rpcUrl);

    const fetchGasPriority = async () => {
      try {
        setLoadingGasPrority(true);
        const gasPriority = await getGasPriorityFee(DEFAULT_BLOCKS, DEFAULT_PERCENTAGE, activeNetwork.rpcUrl);

        setGasPriorityFee(gasPriority);
      } catch (error) {
        console.error('getGasPriority error', error);
      } finally {
        setLoadingGasPrority(false);
      }
    };

    const fetchBlock = async (blockNumber: number) => {
      try {
        setLoading(true);
        const block = await provider.getBlock(blockNumber);

        if (block) append(mapBlockToStore(block));
      } catch (error) {
        console.error('Fetch block error', error);
      } finally {
        setLoading(false);
      }
    };

    const handler = async (blockNumber: number) => {
      fetchGasPriority();
      fetchBlock(blockNumber);
    };

    fetchGasPriority();

    provider.on('block', handler);

    return () => {
      provider.off('block');
      setGasPriorityFee(initialGasProirityState);
      update([]);
    };
  }, [append, update, setLoading, setGasPriorityFee, setLoadingGasPrority, activeNetwork]);

  return children;
}

export default ChainEventsProvider;
