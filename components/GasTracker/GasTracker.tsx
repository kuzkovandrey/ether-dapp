'use client';

import { Card, Flex, Text } from '@radix-ui/themes';

import { type GasProrityFee, Priority } from '@/api';
import { useGasTracker } from '@/hooks';
import { priorityColors } from '@/shared';

function GasTracker() {
  const { gasPriorityFee, isLoading } = useGasTracker();

  return (
    <Flex position="relative" direction="column" gap="1">
      <Flex direction={{ initial: 'column', sm: 'row' }} width="100%" justify="between" gap="4">
        {Object.entries(gasPriorityFee.priorityFees).map(([priority, priorityFee]) => (
          <Fee
            key={priority}
            priority={priority as Priority}
            priorityFee={priorityFee}
            baseFeePerGas={gasPriorityFee.baseFeePerGas}
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
  const totalFee = Number(baseFeePerGas) + Number(priorityFee);
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
        <Text style={{ whiteSpace: 'nowrap' }} weight="bold" color={color} size="8">
          {totalFee} gwei
        </Text>
        <Text color="gray" size="3">
          Base: {baseFeePerGas} | Priority: {priorityFee}
        </Text>
      </Flex>
    </Card>
  );
}

export default GasTracker;
