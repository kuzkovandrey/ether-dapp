import { useEffect } from 'react';
import useSWR from 'swr';

import { GasProrityFee, getProvider } from '@/api';
import { apiControllers, appFetcher } from '@/shared';

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
    gasPriorityFee: isLoading ? initialValue : formatGasProrityFee(gasPriorityFee || initialValue),
    isLoading: isLoading || isValidating,
    error,
  };
}

function formatGasProrityFee({ baseFeePerGas, priorityFees }: GasProrityFee): GasProrityFee {
  const formattedPriorityFees = Object.fromEntries(
    Object.entries(priorityFees).map(([key, value]) => [
      key,
      Number(value) < 1 ? '1' : Math.round(Number(value)).toString(),
    ])
  ) as GasProrityFee['priorityFees'];

  return {
    baseFeePerGas: Math.round(Number(baseFeePerGas)).toString(),
    priorityFees: formattedPriorityFees,
  };
}

export default useGasTracker;
