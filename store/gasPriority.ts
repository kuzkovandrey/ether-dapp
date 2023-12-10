import { create } from 'zustand';

import { GasProrityFee } from '@/helpers/gasPriorityFee';

export type Theme = 'dark' | 'light';

export const initialState: GasProrityFee = {
  baseFeePerGas: '0',
  priorityFees: {
    slow: '0',
    avg: '0',
    fast: '0',
  },
};

interface GasPriorityStore {
  gasPriorityFee: GasProrityFee;
  isLoading: boolean;

  setGasPriorityFee: (gasProrityFee: GasProrityFee) => void;
  setLoading: (isLoading: boolean) => void;
}

const useGasProrityStore = create<GasPriorityStore>((set) => ({
  gasPriorityFee: initialState,
  isLoading: false,

  setGasPriorityFee: (gasPriorityFee: GasProrityFee) => set((state) => ({ ...state, gasPriorityFee })),
  setLoading: (isLoading: boolean) => set((state) => ({ ...state, isLoading })),
}));

export default useGasProrityStore;
