'use client';

import { PersonIcon } from '@radix-ui/react-icons';
import { Callout, Flex, Text } from '@radix-ui/themes';
import { formatEther } from 'ethers';

import { useMetamaskAccountProvider } from '@/metamask/providers';
import { useAppStore } from '@/store';

import { NetworkInfo } from '@/components/molecules';

import { ConnectToMetamask, SendCoin } from '../actions';

function Wallet() {
  const { isConnected, account, balance } = useMetamaskAccountProvider();
  const { activeNetwork } = useAppStore();

  return (
    <Flex gap="4" direction="column" width="100%">
      <NetworkInfo
        name={activeNetwork?.name || 'Unsupported network'}
        isConnected={isConnected}
        actionSlot={<ConnectToMetamask />}
      />

      {isConnected && (
        <Callout.Root color="brown">
          <Callout.Icon>
            <PersonIcon />
          </Callout.Icon>
          <Flex direction="column" gap="2">
            <Text as="div" weight="bold">
              Wallet: {account}
            </Text>
            <Text as="div" weight="bold">
              Balance: {formatEther(balance)} ETH
            </Text>
          </Flex>
        </Callout.Root>
      )}

      {activeNetwork && (
        <Flex align="center" gap="2">
          <SendCoin />
        </Flex>
      )}
    </Flex>
  );
}

export default Wallet;
