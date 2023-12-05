import { useEffect } from 'react';
import useSWR from 'swr';

import { GasProrityFee, getProvider } from '@/api';
import { apiControllers, appFetcher } from '@/shared';

export const MIN_GAS_UNIT = 0.000001;

const initialValue: GasProrityFee = {
  baseFeePerGas: '0',
  priorityFees: {
    slow: '0',
    avg: '0',
    fast: '0',
  },
};

function useGasTracker() {
  const {
    data: gasPriorityFee,
    isLoading,
    isValidating,
    error,
    mutate,
  } = useSWR<GasProrityFee>(apiControllers.getGasPriorityFee, appFetcher, {
    keepPreviousData: true,
    revalidateOnMount: true,
  });

  useEffect(() => {
    const provider = getProvider();
    const handler = () => mutate();

    provider.on('block', handler);

    return () => {
      provider.off('block', handler);
    };
  }, []);

  return {
    gasPriorityFee: isLoading || !gasPriorityFee ? initialValue : gasPriorityFee,
    isLoading: isLoading || isValidating,
    error,
  };
}

export default useGasTracker;
