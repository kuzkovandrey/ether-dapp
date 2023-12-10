import { create } from 'zustand';

import { Network, supportedNetworks } from '@/shared';

export type Theme = 'dark' | 'light';

type AppStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;

  activeNetwork?: Network | null;
  setActiveNetwork: (network?: Network | null) => void;
};

const useAppStore = create<AppStore>((set) => ({
  theme: 'dark',
  setTheme: (theme) => set((state) => ({ ...state, theme })),

  activeNetwork: supportedNetworks[0],
  setActiveNetwork: (network) => set((state) => ({ ...state, activeNetwork: network })),
}));

export default useAppStore;
