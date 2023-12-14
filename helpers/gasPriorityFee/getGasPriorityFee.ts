import { formatUnits, JsonRpcProvider, parseUnits } from 'ethers';

type Percentage = [number, number, number];

export type Priority = 'slow' | 'avg' | 'fast';

export type FeeHistory = {
  reward: Array<[string, string, string]>;
};

export class GasPriorityFee {
  constructor(
    public readonly priorityFees: Record<Priority, string>,
    public readonly baseFeePerGas: string
  ) {}
}

const MIN_GAS_PRIORITY_FEE = parseUnits('0.00000001', 'gwei');

export const DEFAULT_PERCENTAGE: Percentage = [15, 50, 75];
export const DEFAULT_BLOCKS = 5;

/**
 * @throws {GetGasPriorityFeeError}
 */
export default async function getGasPriorityFee({
  provider,
  blocks = DEFAULT_BLOCKS,
  percentage = DEFAULT_PERCENTAGE,
}: {
  provider: JsonRpcProvider;
  blocks?: number;
  percentage?: Percentage;
}): Promise<GasPriorityFee> {
  try {
    const feeHistory: FeeHistory = await provider.send('eth_feeHistory', [blocks, 'latest', percentage]);

    const slow = computeAverage(feeHistory.reward.map((r) => BigInt(formatUnits(r[0], 'wei'))));
    const avg = computeAverage(feeHistory.reward.map((r) => BigInt(formatUnits(r[1], 'wei'))));
    const fast = computeAverage(feeHistory.reward.map((r) => BigInt(formatUnits(r[2], 'wei'))));

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
  } catch (e) {
    throw new GetGasPriorityFeeError();
  }
}

function getMinGasPriorityFee(fee: bigint): bigint {
  const priorityFee = BigInt(fee);

  return priorityFee < MIN_GAS_PRIORITY_FEE ? MIN_GAS_PRIORITY_FEE : priorityFee;
}

export function computeAverage(fees: bigint[]): bigint {
  if (!fees.length) return 0n;

  const sum = fees.reduce((a, v) => a + v, 0n);

  return (sum * 1000n) / BigInt(fees.length) / 1000n;
}

export class GetGasPriorityFeeError extends Error {}
