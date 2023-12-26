'use client';

import { Card, Flex } from '@radix-ui/themes';
import { isAddress } from 'ethers';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { useTokenTransferEvents } from '@/metamask/hooks';
import { useAppStore } from '@/store';

import SubscriptionForm from './SubscriptionForm';
import TokenEventsTable from './TokenEventTable';

type FormValues = {
  contractAddress: string;
  from?: string;
  to?: string;
};

function TokenEvents() {
  const { activeNetwork } = useAppStore();
  const { isSubscribed, subscribe, unsubscribe, events } = useTokenTransferEvents();
  const [formValues, setFormValues] = useState<FormValues>({
    contractAddress: '',
    from: '',
    to: '',
  });

  const onClickSubscribe = () => {
    const values = validateFormValues(formValues);

    if (!values) {
      toast.error('Invalid form values');

      return;
    }

    const { contractAddress: address, from, to } = values;

    subscribe({ address, from, to }, () => {
      toast.error('Token subscription error');
    });
  };

  if (!activeNetwork) return null;

  return (
    <Card>
      <Flex direction="column" gap="4">
        <SubscriptionForm
          onClickSubscribe={onClickSubscribe}
          onClickUnsubscribe={unsubscribe}
          onChange={setFormValues}
          isSubscribed={isSubscribed}
        />
        <TokenEventsTable events={events} />
      </Flex>
    </Card>
  );
}

function validateFormValues(values: FormValues): FormValues | null {
  const { contractAddress, from, to } = values;

  if (!isAddress(contractAddress)) return null;

  return {
    contractAddress,
    from: isAddress(from) ? from : undefined,
    to: isAddress(to) ? to : undefined,
  };
}

export default TokenEvents;
