import { formatUnits, JsonRpcProvider } from 'ethers';

import { RPC_URL } from '@/shared';

import { GetGasPriorityFeeError, GetProviderError } from './errors';

type Percentage = [number, number, number];

export type FeeHistory = {
  reward: Array<[string, string, string]>;
};

export type Priority = 'slow' | 'avg' | 'fast';

export class GasProrityFee {
  constructor(
    public readonly priorityFees: Record<Priority, string>,
    public readonly baseFeePerGas: string
  ) {}
}

export const DEFAULT_PERCENTAGE: Percentage = [25, 60, 78];
export const DEFAULT_BLOCKS = 5;

/**
 * @throws {GetProviderError}
 * @throws {GetGasPriorityFeeError}
 */
export default async function getGasPriorityFee(
  blocks = DEFAULT_BLOCKS,
  percentage = DEFAULT_PERCENTAGE
): Promise<GasProrityFee> {
  const provider = getProvider();

  try {
    return await _getGasPriorityFee(provider, blocks, percentage);
  } finally {
    provider.destroy();
  }
}

export async function _getGasPriorityFee(
  provider: JsonRpcProvider,
  blocks: number,
  percentage: Percentage
): Promise<GasProrityFee> {
  try {
    const feeHistory: FeeHistory = await provider.send('eth_feeHistory', [blocks, 'latest', percentage]);

    const slowFees = computeAvg(feeHistory.reward.map((r) => BigInt(formatUnits(r[0], 'wei'))));
    const avgFees = computeAvg(feeHistory.reward.map((r) => BigInt(formatUnits(r[1], 'wei'))));
    const fastFees = computeAvg(feeHistory.reward.map((r) => BigInt(formatUnits(r[2], 'wei'))));

    const pendingBlock = await provider.getBlock('pending');

    const priorityFees = {
      slow: formatUnits(slowFees, 'gwei'),
      avg: formatUnits(avgFees, 'gwei'),
      fast: formatUnits(fastFees, 'gwei'),
    };
    const baseFeePerGas = parseFloat(formatUnits(pendingBlock?.baseFeePerGas || '0', 'gwei')).toString();

    return new GasProrityFee(priorityFees, baseFeePerGas);
  } catch {
    throw new GetGasPriorityFeeError();
  }
}

export function getProvider(): JsonRpcProvider {
  try {
    return new JsonRpcProvider(RPC_URL, undefined);
  } catch {
    throw new GetProviderError();
  }
}

export function computeAvg(fees: bigint[]): bigint {
  if (!fees.length) return 0n;

  const sum = fees.reduce((a, v) => a + v, 0n);

  return (sum * 1000n) / BigInt(fees.length) / 1000n;
}
