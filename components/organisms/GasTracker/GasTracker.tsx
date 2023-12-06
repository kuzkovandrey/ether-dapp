'use client';

import { Flex } from '@radix-ui/themes';
import { useMemo } from 'react';

import { GasEstimation } from '@/components';
import { Priority } from '@/helpers';
import { MIN_GAS_UNIT } from '@/shared';
import { useGasProrityStore } from '@/store';

import { formatGasProrityFee } from './utils';

function GasTracker() {
  const { gasPriorityFee } = useGasProrityStore();
  const formattedGasPriorityFee = useMemo(() => formatGasProrityFee(gasPriorityFee), [gasPriorityFee]);

  return (
    <Flex direction="column" gap="1">
      <Flex direction={{ initial: 'column', sm: 'row' }} width="100%" justify="between" gap="4">
        {Object.entries(formattedGasPriorityFee.priorityFees).map(([priority, priorityFee]) => (
          <GasEstimation
            minGasUnit={MIN_GAS_UNIT}
            key={priority}
            priority={priority as Priority}
            priorityFee={priorityFee}
            baseFeePerGas={formattedGasPriorityFee.baseFeePerGas}
          />
        ))}
      </Flex>
    </Flex>
  );
}

export default GasTracker;
