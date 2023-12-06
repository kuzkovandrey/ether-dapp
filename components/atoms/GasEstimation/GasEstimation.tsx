import { Card, Flex, Text } from '@radix-ui/themes';

const priorityColors: { [key: string]: 'red' | 'yellow' | 'grass' | 'gray' } = {
  slow: 'yellow',
  avg: 'grass',
  fast: 'red',
  default: 'gray',
};

export type GasEstimationProps = {
  baseFeePerGas: string;
  priorityFee: string;
  priority: string;
  minGasUnit: string | number;
};

function GasEstimation({ baseFeePerGas, priorityFee, priority, minGasUnit }: GasEstimationProps) {
  const totalFee = (parseFloat(baseFeePerGas) + parseFloat(priorityFee)).toFixed(6);
  const color = priorityColors[priority] || priorityColors.default;

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
            Priority: {parseFloat(priorityFee) || `<${minGasUnit}`}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}

export default GasEstimation;
