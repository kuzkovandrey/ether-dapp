import { JsonRpcProvider } from 'ethers';
import { PropsWithChildren, useEffect } from 'react';

import { getGasPriorityFee } from '@/helpers';
import { useAppStore } from '@/store';
import { useAppDispatch } from '@/store/redux-store';
import { append, mapBlockToStore, setLoading, update } from '@/store/redux-store/blocks';
import { initialState, setGasPriorityFee, setLoading as setLoadingGasPrority } from '@/store/redux-store/gasProrityFee';

function ChainEventsProvider({ children }: PropsWithChildren) {
  const { activeNetwork } = useAppStore();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!activeNetwork) return;

    const provider = new JsonRpcProvider(activeNetwork.rpcUrl, undefined);

    const fetchGasPriority = async () => {
      try {
        dispatch(setLoadingGasPrority(true));
        const gasPriority = await getGasPriorityFee({ provider });

        dispatch(setGasPriorityFee(gasPriority));
      } catch (error) {
        console.error('getGasPriority error', error);
      } finally {
        dispatch(setLoadingGasPrority(false));
      }
    };

    const fetchBlock = async (blockNumber: number) => {
      try {
        dispatch(setLoading(true));
        const block = await provider.getBlock(blockNumber);

        if (block) dispatch(append(mapBlockToStore(block)));
      } catch (error) {
        console.error('Fetch block error', error);
      } finally {
        dispatch(setLoading(false));
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
      dispatch(setGasPriorityFee(initialState.gasPriorityFee));
      dispatch(update([]));
    };
  }, [activeNetwork]);

  return children;
}

export default ChainEventsProvider;
