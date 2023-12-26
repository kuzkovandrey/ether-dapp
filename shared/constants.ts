type Route = {
  href: string;
  name: string;
};

export const appRoutes = {
  home: <Route>{ href: '/', name: 'Home' },
} as const;

export type Network = {
  name: string;
  chainId: number;
  token: string;
  rpcUrl: string;
  explorerUrl: string;
};

export const supportedNetworks: Network[] = [
  {
    name: 'Sepolia Testnet',
    chainId: 11155111,
    token: 'ETH',
    rpcUrl: 'https://rpc.sepolia.org',
    explorerUrl: 'https://sepolia.etherscan.io',
  },
  {
    chainId: 1,
    name: 'Ethereum mainnet',
    token: 'ETH',
    rpcUrl: 'https://ethereum.publicnode.com',
    explorerUrl: 'https://etherscan.io',
  },
];
