import { formatUnits, JsonRpcProvider, parseUnits } from 'ethers';

import { getProvider } from '../provider';

type Percentage = [number, number, number];

const MIN_GAS_PRIORITY_FEE = parseUnits('1', 'gwei');

export type FeeHistory = {
  reward: Array<[string, string, string]>;
};

export type Priority = 'slow' | 'avg' | 'fast';

export class GasPriorityFee {
  constructor(
    public readonly priorityFees: Record<Priority, string>,
    public readonly baseFeePerGas: string
  ) {}
}

export const DEFAULT_PERCENTAGE: Percentage = [35, 60, 90];
export const DEFAULT_BLOCKS = 5;

/**
 * @throws {GetProviderError}
 * @throws {GetGasPriorityFeeError}
 */
export default async function getGasPriorityFee(
  blocks = DEFAULT_BLOCKS,
  percentage = DEFAULT_PERCENTAGE,
  rpcUrl?: string
): Promise<GasPriorityFee> {
  const provider = getProvider(rpcUrl);

  try {
    return await _getGasPriorityFee(provider, blocks, percentage);
  } finally {
    provider.destroy();
  }
}

function getMinGasPriorityFee(fee: bigint): bigint {
  const priorityFee = BigInt(fee);

  return priorityFee < MIN_GAS_PRIORITY_FEE ? MIN_GAS_PRIORITY_FEE : priorityFee;
}

export async function _getGasPriorityFee(
  provider: JsonRpcProvider,
  blocks: number,
  percentage: Percentage
): Promise<GasPriorityFee> {
  try {
    const feeHistory: FeeHistory = await provider.send('eth_feeHistory', [blocks, 'latest', percentage]);

    const slow = computeAvg(feeHistory.reward.map((r) => BigInt(formatUnits(r[0], 'wei'))));
    const avg = computeAvg(feeHistory.reward.map((r) => BigInt(formatUnits(r[1], 'wei'))));
    const fast = computeAvg(feeHistory.reward.map((r) => BigInt(formatUnits(r[2], 'wei'))));

    const pendingBlock = await provider.getBlock('pending');

    const baseFeePerGas = String(pendingBlock?.baseFeePerGas || '0');

    return new GasPriorityFee(
      {
        slow: getMinGasPriorityFee(slow).toString(),
        avg: getMinGasPriorityFee(avg).toString(),
        fast: getMinGasPriorityFee(fast).toString(),
      },
      baseFeePerGas
    );
  } catch {
    throw new GetGasPriorityFeeError();
  }
}

export function computeAvg(fees: bigint[]): bigint {
  if (!fees.length) return 0n;

  const sum = fees.reduce((a, v) => a + v, 0n);

  return (sum * 1000n) / BigInt(fees.length) / 1000n;
}

export class GetGasPriorityFeeError extends Error {}
