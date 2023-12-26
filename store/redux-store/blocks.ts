import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Block as EthersBlock } from 'ethers';

export type Block = {
  hash: string | null;
  number: number;
  gasUsed: string;
  gasLimit: string;
  baseFee: string | null;
  txCount: number;
};

interface BlocksState {
  blocks: Block[];
  page: number;
  pages: number;
  limit: number;
  isLoading: boolean;
}

const initialState: BlocksState = {
  blocks: [],
  isLoading: false,
  page: 1,
  pages: 1,
  limit: 5,
};

export const blocksSlice = createSlice({
  name: 'blocks',
  initialState,
  reducers: {
    append: (state, { payload }: PayloadAction<Block>) => {
      const updatedBlocks = [payload, ...state.blocks];
      const pages = Math.ceil(updatedBlocks.length / state.limit) || 1;

      state.blocks = updatedBlocks;
      state.pages = pages;
    },
    update: (state, { payload }: PayloadAction<Block[]>) => {
      const pages = Math.ceil(payload.length / state.limit) || 1;

      state.pages = pages;
      state.blocks = payload;
    },
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setPage: (state, { payload }: PayloadAction<number>) => {
      state.page = payload;
    },
  },
});

export function mapBlockToStore(block: EthersBlock): Block {
  return {
    hash: block.hash,
    number: block.number,
    gasUsed: String(block.gasUsed),
    gasLimit: String(block.gasLimit),
    baseFee: block.baseFeePerGas ? String(block.baseFeePerGas) : null,
    txCount: block.transactions.length || block.prefetchedTransactions.length || 0,
  };
}
export const { update, setLoading, setPage, append } = blocksSlice.actions;

export default blocksSlice.reducer;
