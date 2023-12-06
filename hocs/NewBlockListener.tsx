import { PropsWithChildren, useEffect } from 'react';

import { DEFAULT_BLOCKS, DEFAULT_PERCENTAGE, getGasPriorityFee, getProvider } from '@/helpers';
import { mapBlockToStore, useAppStore, useBlockStore, useGasProrityStore } from '@/store';

function NewBlockListener({ children }: PropsWithChildren) {
  const { chain } = useAppStore();
  const { append, update, setLoading } = useBlockStore();
  const { setGasPriorityStore, setLoading: setLoadingGasPrority } = useGasProrityStore();

  useEffect(() => {
    const provider = getProvider();

    const fetchGasPriority = async () => {
      try {
        setLoadingGasPrority(true);
        const gasPriority = await getGasPriorityFee(DEFAULT_BLOCKS, DEFAULT_PERCENTAGE, chain.rpcUrl);

        setGasPriorityStore(gasPriority);
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
      update([]);
    };
  }, [append, update, setLoading]);

  return children;
}

export default NewBlockListener;
