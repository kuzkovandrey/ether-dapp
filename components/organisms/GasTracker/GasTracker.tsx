'use client';

import { Flex } from '@radix-ui/themes';

import { GasEstimation } from '@/components';
import { Priority } from '@/helpers';
import { useGasProrityStore } from '@/store';

function GasTracker() {
  const { gasPriorityFee } = useGasProrityStore();

  return (
    <Flex direction="column" gap="1">
      <Flex direction={{ initial: 'column', sm: 'row' }} width="100%" justify="between" gap="4">
        {Object.entries(gasPriorityFee.priorityFees).map(([priority, priorityFee]) => (
          <GasEstimation
            key={priority}
            priority={priority as Priority}
            priorityFee={priorityFee}
            baseFeePerGas={gasPriorityFee.baseFeePerGas}
          />
        ))}
      </Flex>
    </Flex>
  );
}

export default GasTracker;
