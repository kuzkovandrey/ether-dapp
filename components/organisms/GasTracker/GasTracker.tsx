'use client';

import { Flex } from '@radix-ui/themes';
import { formatUnits } from 'ethers';

import { type Priority } from '@/helpers';
import { useAppSelector } from '@/store/redux-store';

import { GasEstimation } from '@/components/atoms';

function GasTracker() {
  const { gasPriorityFee } = useAppSelector((store) => store.gasPriorityFee);

  return (
    <Flex data-testid="gas-tracker" direction="column" gap="1">
      <Flex direction={{ initial: 'column', sm: 'row' }} width="100%" justify="between" gap="4">
        {Object.entries(gasPriorityFee.priorityFees).map(([priority, priorityFee]) => (
          <GasEstimation
            key={priority}
            priority={priority as Priority}
            priorityFee={formatPriorityFee(priorityFee)}
            base={formatBase(gasPriorityFee.baseFeePerGas)}
            totalFee={calculateTotalFee(gasPriorityFee.baseFeePerGas, priorityFee)}
          />
        ))}
      </Flex>
    </Flex>
  );
}

export const formatPriorityFee = (priorityFee: string) => formatUnits(priorityFee, 'gwei').toString();

export const formatBase = (baseFeePerGas: string) => formatUnits(baseFeePerGas, 'gwei').toString();

export const calculateTotalFee = (baseFeePerGas: string, priorityFee: string) =>
  formatUnits(BigInt(baseFeePerGas) + BigInt(priorityFee), 'gwei');

export default GasTracker;
