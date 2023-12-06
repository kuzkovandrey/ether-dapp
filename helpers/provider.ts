import { JsonRpcProvider } from 'ethers';

import { supportedChains } from '@/shared';

export function getProvider(rpcUrl = supportedChains[0].rpcUrl): JsonRpcProvider {
  try {
    return new JsonRpcProvider(rpcUrl, undefined);
  } catch {
    throw new GetProviderError();
  }
}

export class GetProviderError extends Error {}
