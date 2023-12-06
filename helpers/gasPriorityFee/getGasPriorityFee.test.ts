import { Block, formatUnits, JsonRpcProvider, parseUnits, toBeHex } from 'ethers';

import {
  _getGasPriorityFee,
  computeAvg,
  DEFAULT_BLOCKS,
  DEFAULT_PERCENTAGE,
  FeeHistory,
  GasProrityFee,
  GetGasPriorityFeeError,
} from './getGasPriorityFee';

describe('[Helpers]: computeAvg function', () => {
  test('Positive cases', () => {
    expect(computeAvg([1000n, 2000n, 3000n])).toBe(2000n);
    expect(computeAvg([1234567n, 876522455n, 12387634n])).toBe(296714885n);
  });

  test('Negative cases', () => {
    expect(computeAvg([])).toBeDefined();
    expect(computeAvg([])).toBe(0n);
    expect(computeAvg([0n, 0n, 0n])).toBe(0n);
  });
});

describe('[Mock api call - positive cases]: _getGasPriorityFee function', () => {
  let rewards: FeeHistory['reward'];
  let expectedPriorityFees: GasProrityFee['priorityFees'];
  let blocks: number;
  let mockProvider: JsonRpcProvider;

  beforeEach(() => {
    blocks = generateIntNumber();

    const { expectedPriorityFees: generatedExpectedPriorityFees, rewards: generatedRewards } = generateRewards(blocks);

    rewards = generatedRewards;
    expectedPriorityFees = generatedExpectedPriorityFees;

    mockProvider = {
      send: (): Promise<FeeHistory> =>
        Promise.resolve({
          reward: rewards,
        }),
      getBlock: (): Promise<Block> => Promise.resolve({ baseFeePerGas: parseUnits('1', 'gwei') } as Block),
    } as unknown as JsonRpcProvider;
  });

  for (let i = 0; i < 10; i++) {
    test(`Positive cases: ${i}`, async () => {
      const result = await _getGasPriorityFee(mockProvider, blocks, DEFAULT_PERCENTAGE);

      expect(result).toBeInstanceOf(GasProrityFee);
      expect(result).toEqual(new GasProrityFee(expectedPriorityFees, '1'));
    });
  }
});

describe('[Mock api call - negative cases]: _getGasPriorityFee function', () => {
  test(`should be throw GetGasPriorityFeeError from 'send' method`, async () => {
    const mockProvider = {
      send: (): Promise<FeeHistory> => Promise.reject(new GetGasPriorityFeeError()),
      getBlock: (): Promise<Block> => Promise.resolve({ baseFeePerGas: parseUnits('1', 'gwei') } as Block),
    } as unknown as JsonRpcProvider;

    const call = async () => await _getGasPriorityFee(mockProvider, DEFAULT_BLOCKS, DEFAULT_PERCENTAGE);

    await expect(call()).rejects.toThrow(GetGasPriorityFeeError);
  });

  test(`should be throw GetGasPriorityFeeError from 'getBlock' method`, async () => {
    const { rewards: reward } = generateRewards(DEFAULT_BLOCKS);

    const mockProvider = {
      send: (): Promise<FeeHistory> => Promise.resolve({ reward }),
      getBlock: (): Promise<Block> => Promise.reject(new GetGasPriorityFeeError()),
    } as unknown as JsonRpcProvider;

    const call = async () => await _getGasPriorityFee(mockProvider, DEFAULT_BLOCKS, DEFAULT_PERCENTAGE);

    await expect(call()).rejects.toThrow(GetGasPriorityFeeError);
  });
});

function generateRewards(blocks: number): {
  rewards: FeeHistory['reward'];
  expectedPriorityFees: GasProrityFee['priorityFees'];
} {
  const rewards = Array(blocks)
    .fill(null)
    .map(() => {
      return new Array(3).fill(null).map(() => toBeHex(parseUnits(generateRandomNumber(), 'gwei'))) as [
        string,
        string,
        string,
      ];
    });

  const slow = computeAvg(rewards.map((r) => BigInt(formatUnits(r[0], 'wei'))));
  const avg = computeAvg(rewards.map((r) => BigInt(formatUnits(r[1], 'wei'))));
  const fast = computeAvg(rewards.map((r) => BigInt(formatUnits(r[2], 'wei'))));

  const expectedPriorityFees: GasProrityFee['priorityFees'] = {
    slow: formatUnits(slow, 'gwei'),
    avg: formatUnits(avg, 'gwei'),
    fast: formatUnits(fast, 'gwei'),
  };

  return { rewards, expectedPriorityFees };
}

function generateRandomNumber() {
  const max = 7;
  const min = 0.001;

  return (Math.random() * (max - min) + min).toFixed(6);
}

function generateIntNumber() {
  const max = 20;
  const min = 1;

  return Number(parseInt(String(Math.random() * (max - min) + min)));
}
