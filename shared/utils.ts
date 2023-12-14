import { Priority } from '@/helpers';

export const formatHashToDisplay = (hash: string, before = 3, after = 5) => {
  if (hash.length <= before + after) {
    return hash;
  }

  return hash.substring(0, before) + '...' + hash.substring(hash.length - after);
};

const getBaseFeeMultiplier = (priority: Priority): bigint => {
  if (priority === 'slow') return 125n;

  if (priority === 'avg') return 150n;

  return 200n;
};

export const getGasPriceByPriority = (gasPrice: bigint, priority: Priority): bigint => {
  const multiplier = getBaseFeeMultiplier(priority);

  return (gasPrice * multiplier) / 100n;
};

export const calculateTimeDifference = () => {
  const SEC = 1000;
  const time = {
    start: 0,
    end: 0,
  };

  const start = () => {
    time.start = Date.now();
  };

  const stop = () => {
    time.end = Date.now();

    return (time.end - time.start) / SEC;
  };

  return {
    start,
    stop,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setupFetchStub(data: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function fetchStub(_url: URL): Promise<any> {
    return new Promise((resolve) => {
      resolve({
        json: () =>
          Promise.resolve({
            data,
          }),
      });
    });
  };
}
