import { urlJoin } from 'url-join-ts';

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
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/demo',
    blockchainExplorerUrl: 'https://sepolia.etherscan.io',
  },
];
