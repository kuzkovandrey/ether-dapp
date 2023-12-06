import { create } from 'zustand';

import { Chain, supportedChains } from '@/shared';

export type Theme = 'dark' | 'light';

type AppStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;

  chain: Chain;
  setChain: (chain: Chain) => void;
};

const useAppStore = create<AppStore>((set) => ({
  theme: 'dark',
  setTheme: (theme: Theme) => set((state) => ({ ...state, theme })),

  chain: supportedChains[0],
  setChain: (chain: Chain) => set((state) => ({ ...state, chain })),
}));

export default useAppStore;
