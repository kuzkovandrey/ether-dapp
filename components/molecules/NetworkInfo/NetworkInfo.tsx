import { Badge, Card, Flex, Heading } from '@radix-ui/themes';
import { ReactNode } from 'react';

export type NetworkInfoProps = {
  name: string;
  connectedTo?: string;
  isConnected: boolean;
  actionSlot?: ReactNode;
};

function NetworkInfo({ name, isConnected, connectedTo, actionSlot }: NetworkInfoProps) {
  return (
    <Card style={{ width: '100%' }}>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Heading size="3">Network: {name}</Heading>
          <Flex gap="2" align="center">
            {connectedTo}
            <Badge size="2" color={isConnected ? 'green' : 'red'}>
              {isConnected ? 'Connected' : 'Not connected'}
            </Badge>
          </Flex>
        </Flex>
        {actionSlot}
      </Flex>
    </Card>
  );
}

export default NetworkInfo;
