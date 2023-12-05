import { urlJoin } from 'url-join-ts';

import { Priority } from '@/api';

import { APP_URL } from './env';

export const GAS_PRIORITY_FEE_REVALIDATE_INTERVAL = 15000;

export const apiControllers = {
  getGasPriorityFee: urlJoin(APP_URL, 'api', 'gas-tracker'),
} as const;

type Route = {
  href: string;
  name: string;
};

export const appRoutes: { [route: string]: Route } = {
  GAS_TRACKER: { href: '/', name: 'Home' },
};

export const supportedChains = [
  {
    chainId: 11155111,
    token: 'ETH',
    rpcUrl: 'https://rpc.sepolia.org',
    blockchainExplorerUrl: 'https://sepolia.etherscan.io',
  },
];

export const priorityColors: { [key in Priority]: 'red' | 'yellow' | 'grass' } = {
  slow: 'yellow',
  avg: 'grass',
  fast: 'red',
};