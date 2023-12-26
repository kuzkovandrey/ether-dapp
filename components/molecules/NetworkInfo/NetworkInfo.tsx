import { Badge, Card, Flex, Heading } from '@radix-ui/themes';
import { ReactNode } from 'react';

export type NetworkInfoProps = {
  name: string;
  isConnected: boolean;
  actionSlot?: ReactNode;
};

function NetworkInfo({ name, isConnected, actionSlot }: NetworkInfoProps) {
  return (
    <Card data-testid="network-info" style={{ width: '100%' }}>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Heading data-testid="network-info-heading" size="3">
            Network: {name}
          </Heading>
          <Flex gap="2" align="center">
            <Badge data-testid="network-info-badge" size="2" color={isConnected ? 'green' : 'red'}>
              {isConnected ? 'Connected' : 'Not connected'}
            </Badge>
          </Flex>
        </Flex>
        {actionSlot && <div data-testid="network-info-action-slot">{actionSlot}</div>}
      </Flex>
    </Card>
  );
}

export default NetworkInfo;
