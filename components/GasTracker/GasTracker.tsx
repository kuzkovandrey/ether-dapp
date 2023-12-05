'use client';

import { Card, Flex, Text } from '@radix-ui/themes';
import { useMemo } from 'react';

import { type GasProrityFee, Priority } from '@/api';
import { useGasTracker } from '@/hooks';
import { MIN_GAS_UNIT } from '@/hooks/useGasTracker';
import { formatGasProrityFee, priorityColors } from '@/shared';

function GasTracker() {
  const { gasPriorityFee, isLoading } = useGasTracker();
  const formattedGasPriorityFee = useMemo(() => formatGasProrityFee(gasPriorityFee), [gasPriorityFee]);

  return (
    <Flex position="relative" direction="column" gap="1">
      <Flex direction={{ initial: 'column', sm: 'row' }} width="100%" justify="between" gap="4">
        {Object.entries(formattedGasPriorityFee.priorityFees).map(([priority, priorityFee]) => (
          <Fee
            key={priority}
            priority={priority as Priority}
            priorityFee={priorityFee}
            baseFeePerGas={formattedGasPriorityFee.baseFeePerGas}
          />
        ))}
      </Flex>
      {isLoading && (
        <Text style={{ position: 'absolute', bottom: '-1.5rem', left: 0 }} size="2" color="gray">
          Updating...
        </Text>
      )}
    </Flex>
  );
}

type FeeProps = {
  baseFeePerGas: GasProrityFee['baseFeePerGas'];
  priorityFee: string;
  priority: Priority;
};

function Fee({ baseFeePerGas, priorityFee, priority }: FeeProps) {
  const totalFee = (parseFloat(baseFeePerGas) + parseFloat(priorityFee)).toFixed(6);
  const color = priorityColors[priority] || 'gray';

  return (
    <Card style={{ padding: '0.5rem', width: '100%' }}>
      <Flex align="center" direction="column" gap="2">
        <Text
          weight="bold"
          style={{
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
          }}
          size="4"
        >
          {priority}
        </Text>
        <Text align="center" weight="bold" color={color} size="8">
          {totalFee} gwei
        </Text>
        <Flex align="center" direction="column">
          <Text color="gray" size="3">
            Base: {baseFeePerGas}
          </Text>

          <Text color="gray" size="3">
            Priority: {parseFloat(priorityFee) || `<${MIN_GAS_UNIT}`}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}

export default GasTracker;
