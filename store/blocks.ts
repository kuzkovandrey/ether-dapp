import type { Block as EthersBlock } from 'ethers';
import { create } from 'zustand';

export type Block = {
  hash: string | null;
  number: number;
  gasUsed: bigint;
  gasLimit: bigint;
  baseFee: bigint | null;
  txCount: number;
};

export type BlockStore = {
  blocks: Block[];
  page: number;
  pages: number;
  limit: number;
  isLoading: boolean;
  append: (b: Block) => void;
  update: (b: Block[]) => void;
  setLoading: (isLoading: boolean) => void;
  setPage: (page: number) => void;
};

const useBlockStore = create<BlockStore>((set) => ({
  blocks: [],
  isLoading: false,
  page: 1,
  pages: 1,
  limit: 5,

  append: (block: Block) =>
    set((state) => {
      const updatedBlocks = [block, ...state.blocks];
      const pages = Math.ceil(updatedBlocks.length / state.limit) || 1;

      return { blocks: updatedBlocks, pages };
    }),
  update: (blocks: Block[]) =>
    set((state) => {
      const pages = Math.ceil(blocks.length / state.limit) || 1;

      return { blocks, pages };
    }),
  setLoading: (isLoading: boolean) => set((state) => ({ ...state, isLoading })),
  setPage: (page: number) => set((state) => ({ ...state, page })),
}));

export function mapBlockToStore(block: EthersBlock): Block {
  return {
    hash: block.hash,
    number: block.number,
    gasUsed: block.gasUsed,
    gasLimit: block.gasLimit,
    baseFee: block.baseFeePerGas,
    txCount: block.transactions.length || block.prefetchedTransactions.length || 0,
  };
}

export default useBlockStore;
