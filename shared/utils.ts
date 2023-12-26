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
