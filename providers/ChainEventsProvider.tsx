import { JsonRpcProvider } from 'ethers';
import { PropsWithChildren, useEffect } from 'react';

import { getGasPriorityFee } from '@/helpers';
import { initialGasProirityState, mapBlockToStore, useAppStore, useBlockStore, useGasProrityStore } from '@/store';

function ChainEventsProvider({ children }: PropsWithChildren) {
  const { activeNetwork } = useAppStore();
  const { append, update, setLoading } = useBlockStore();
  const { setGasPriorityFee, setLoading: setLoadingGasPrority } = useGasProrityStore();

  useEffect(() => {
    if (!activeNetwork) return;

    const provider = new JsonRpcProvider(activeNetwork.rpcUrl, undefined);

    const fetchGasPriority = async () => {
      try {
        setLoadingGasPrority(true);
        const gasPriority = await getGasPriorityFee({ provider });

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

    fetchGasPriority();

    const handlers = async (blockNumber: number) => {
      fetchGasPriority();
      fetchBlock(blockNumber);
    };

    provider.on('block', handlers);

    return () => {
      provider.off('block', handlers);
      provider.destroy();
      setGasPriorityFee(initialGasProirityState);
      update([]);
    };
  }, [activeNetwork]);

  return children;
}

export default ChainEventsProvider;
