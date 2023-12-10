import { JsonRpcProvider } from 'ethers';

import { supportedNetworks } from '@/shared';

export function getProvider(rpcUrl = supportedNetworks[0].rpcUrl): JsonRpcProvider {
  try {
    return new JsonRpcProvider(rpcUrl, undefined);
  } catch {
    throw new GetProviderError();
  }
}

export class GetProviderError extends Error {}
