import { CheckCircledIcon, CrossCircledIcon, RocketIcon } from '@radix-ui/react-icons';
import { Button, Flex, Text, TextField } from '@radix-ui/themes';
import { ChangeEvent, useEffect, useState } from 'react';

export type FormValues = {
  contractAddress: string;
  from?: string;
  to?: string;
};

type SubscriptionFormProps = {
  isSubscribed: boolean;
  onClickSubscribe: () => void;
  onClickUnsubscribe: () => void;
  onChange: (v: FormValues) => void;
};

function SubscriptionForm({
  isSubscribed,
  onClickSubscribe,
  onClickUnsubscribe,
  onChange: onChangeProp,
}: SubscriptionFormProps) {
  const [formValues, setFormValues] = useState<FormValues>({
    contractAddress: '',
    from: '',
    to: '',
  });

  const onChange = (event: ChangeEvent<HTMLInputElement>, field: keyof FormValues) => {
    setFormValues((values) => ({ ...values, [field]: event.target.value }));
  };

  useEffect(() => {
    onChangeProp(formValues);
  }, [formValues, onChangeProp]);

  return (
    <Flex direction="column" gap="2">
      <Text>Subscription form </Text>
      <TextField.Root>
        <TextField.Slot>
          <RocketIcon height="16" width="16" />
        </TextField.Slot>
        <TextField.Input
          onChange={(event) => onChange(event, 'contractAddress')}
          size="3"
          placeholder="*Contract address"
        />
      </TextField.Root>
      <TextField.Input onChange={(event) => onChange(event, 'from')} size="3" placeholder="From address" />
      <TextField.Input onChange={(event) => onChange(event, 'to')} size="3" placeholder="To address" />
      {isSubscribed ? (
        <Button color="orange" size="3" onClick={onClickUnsubscribe}>
          <CrossCircledIcon height="20" width="20" />
          Unsubscribe
        </Button>
      ) : (
        <Button color="green" size="3" onClick={onClickSubscribe}>
          <CheckCircledIcon height="20" width="20" /> Subscribe
        </Button>
      )}
    </Flex>
  );
}

export default SubscriptionForm;
