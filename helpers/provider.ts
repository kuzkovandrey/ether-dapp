import { JsonRpcProvider } from 'ethers';

export function getProvider(rpcUrl: string): JsonRpcProvider {
  try {
    return new JsonRpcProvider(rpcUrl, undefined);
  } catch {
    throw new GetProviderError();
  }
}

export class GetProviderError extends Error {}
