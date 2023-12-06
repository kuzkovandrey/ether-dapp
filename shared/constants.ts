import { urlJoin } from 'url-join-ts';

import { APP_URL } from './env';

export const MIN_GAS_UNIT = 0.000001;

export const apiControllers = {
  getGasPriorityFee: urlJoin(APP_URL, 'api', 'gas-tracker'),
} as const;

type Route = {
  href: string;
  name: string;
};

export const appRoutes = {
  home: <Route>{ href: '/', name: 'Home' },
} as const;

export type Chain = {
  name: string;
  chainId: number;
  token: string;
  rpcUrl: string;
  explorerUrl: string;
};

export const supportedChains: Chain[] = [
  {
    name: 'Sepolia testnet',
    chainId: 11155111,
    token: 'ETH',
    rpcUrl: 'https://rpc.sepolia.org',
    explorerUrl: 'https://sepolia.etherscan.io',
  },
  {
    chainId: 1,
    name: 'Ethereum',
    token: 'ETH',
    rpcUrl: 'https://ethereum.publicnode.com',
    explorerUrl: 'https://etherscan.io',
  },
];
