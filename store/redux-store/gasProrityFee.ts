import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GasProrityFee } from '@/helpers';

type GasPriorityFeeState = {
  gasPriorityFee: GasProrityFee;
  isLoading: boolean;
};

export const initialState: GasPriorityFeeState = {
  gasPriorityFee: {
    baseFeePerGas: '0',
    priorityFees: {
      slow: '0',
      avg: '0',
      fast: '0',
    },
  },
  isLoading: false,
};

export const gasPriorityFeeSlice = createSlice({
  name: 'gasProrityFee',
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setGasPriorityFee: (state, { payload }: PayloadAction<GasProrityFee>) => {
      state.gasPriorityFee = payload;
    },
  },
});

export const { setLoading, setGasPriorityFee } = gasPriorityFeeSlice.actions;

export default gasPriorityFeeSlice.reducer;
