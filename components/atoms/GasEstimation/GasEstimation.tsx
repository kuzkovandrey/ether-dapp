import { Card, Flex, Text } from '@radix-ui/themes';

export type GasEstimationProps = {
  priority: string;
  base: string;
  priorityFee: string;
  totalFee: string;
};

function GasEstimation({ base, priorityFee, totalFee, priority }: GasEstimationProps) {
  const color = priorityColors[priority] || priorityColors.default;

  return (
    <Card data-testid="gas-estimation" style={{ padding: '0.5rem', width: '100%' }}>
      <Flex align="center" direction="column" gap="2">
        <Text
          weight="bold"
          style={{
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
          }}
          size="4"
          data-testid="gas-estimation-priority"
        >
          {priority}
        </Text>
        <Text data-testid="gas-estimation-total-fee" align="center" weight="bold" color={color} size="8">
          {totalFee} <br />
          gwei
        </Text>
        <Flex align="center" direction="column">
          <Text data-testid="gas-estimation-base" color="gray" size="3">
            Base: {base}
          </Text>
          <Text data-testid="gas-estimation-priority-fee" color="gray" size="3">
            Priority: {priorityFee}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}

const priorityColors: { [key: string]: 'red' | 'yellow' | 'grass' | 'gray' } = {
  slow: 'yellow',
  avg: 'grass',
  fast: 'red',
  default: 'gray',
};

export default GasEstimation;
