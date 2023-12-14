'use client';

import { Button, Flex } from '@radix-ui/themes';
import { PropsWithChildren, useCallback } from 'react';
import { toast } from 'react-toastify';

import { useMetamaskAccountProvider, useMetamaskProvider } from '@/metamask/providers';
import { MetamaskIcon } from '@/public/icons';
import { formatHashToDisplay } from '@/shared';

function ConnectToMetamask() {
  const { isSupported, isReady } = useMetamaskProvider();
  const { isConnected, connect, account } = useMetamaskAccountProvider();

  const onError = useCallback((message: string) => toast.error(message), []);

  const onClick = useCallback(() => {
    connect(({ message }) => onError(message));
  }, [connect, onError]);

  if (!isReady) {
    return <ConnectButton>Loading...</ConnectButton>;
  }

  if (!isSupported) {
    return <ConnectButton isDisabled>Metamask is not supported</ConnectButton>;
  }

  if (!isConnected) {
    return <ConnectButton onClick={onClick}>Connect to Metamask</ConnectButton>;
  }

  return <ConnectButton color="amber">{formatHashToDisplay(account, 4)}</ConnectButton>;
}

type ConnectButtonProps = PropsWithChildren<{
  color?: 'gray' | 'amber' | 'blue';
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}>;

function ConnectButton({ children, isDisabled, color = 'blue', onClick }: ConnectButtonProps) {
  return (
    <Button
      size="3"
      onClick={onClick}
      disabled={isDisabled}
      color={color}
      style={{ width: 'fit-content', padding: ' 1rem' }}
    >
      <Flex gap="2" align="center">
        <div style={{ width: '1.5rem', height: '1.5rem' }}>
          <MetamaskIcon />
        </div>
        <div>{children}</div>
      </Flex>
    </Button>
  );
}

export default ConnectToMetamask;
