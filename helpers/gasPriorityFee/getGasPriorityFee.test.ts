import { JsonRpcProvider } from 'ethers';

import { blockResponse, ethFeeHistoryResponse } from './__mocks__';
import getGasPriorityFee, { computeAverage, GasPriorityFee, GetGasPriorityFeeError } from './getGasPriorityFee';

/**
 * @description Clean function testing;
 */
describe('computeAverage function', () => {
  test('# positive cases', () => {
    expect(computeAverage([1000n, 2000n, 3000n])).toBe(2000n);
    expect(computeAverage([1234567n, 876522455n, 12387634n])).toBe(296714885n);
  });

  test('# negative cases', () => {
    expect(computeAverage([])).toBeDefined();
    expect(computeAverage([])).toBe(0n);
    expect(computeAverage([0n, 0n, 0n])).toBe(1n);
  });
});

/**
 * @description getGasPriorityFee testing with mock JsonRpcProvider
 */
describe('GasPriorityFee function', () => {
  let provider: JsonRpcProvider;
  let rejectProvider: JsonRpcProvider;

  beforeEach(() => {
    provider = {
      send: () => Promise.resolve(ethFeeHistoryResponse),
      getBlock: () => Promise.resolve(blockResponse),
    } as unknown as JsonRpcProvider;

    rejectProvider = {
      send: () => Promise.reject(new Error()),
      getBlock: () => Promise.reject(new Error()),
    } as unknown as JsonRpcProvider;
  });

  test('# should be get GasPriorityFee object', () => {
    expect(getGasPriorityFee({ provider })).resolves.toBeInstanceOf(GasPriorityFee);
  });

  test('# should be throw GetGasPriorityFeeError error', () => {
    expect(getGasPriorityFee({ provider: rejectProvider })).rejects.toBeInstanceOf(GetGasPriorityFeeError);
  });

  beforeAll(() => {
    provider = null!;
    rejectProvider = null!;
  });
});
