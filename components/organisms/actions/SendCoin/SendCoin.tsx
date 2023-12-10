'use client';

import { Button, Dialog, Flex, RadioGroup, Text, TextField } from '@radix-ui/themes';
import { FeeData, formatEther, getAddress, isAddress, parseEther, parseUnits } from 'ethers';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { GasProrityFee, Priority as PriorityType } from '@/helpers';
import { useDebounce } from '@/hooks';
import { MetamaskError } from '@/metamask';
import { useMetamaskAccountProvider, useMetamaskProvider } from '@/metamask/providers';
import { useGasProrityStore } from '@/store';

type FormValues = { to: string; amount: string; customFee: string; priority: PriorityType };

const initialValues: FormValues = {
  to: '',
  amount: '',
  customFee: '',
  priority: 'slow',
};

function SendCoin() {
  const { provider, isSupported } = useMetamaskProvider();
  const { isConnected, isSupportedChain, updateBalance } = useMetamaskAccountProvider();
  const { gasPriorityFee } = useGasProrityStore();

  const [isOpen, setIsOpen] = useState(false);
  const [commission, setCommission] = useState({ estimated: '', max: '' });
  const [isLoadingFee, setIsLoadingFee] = useState(false);
  const [isLoadingSend, setIsLoadingSend] = useState(false);

  const { values, handleChange, setValues } = useFormik<FormValues>({
    initialValues,
    onSubmit: useCallback(() => {}, []),
    validateOnBlur: false,
    validateOnMount: false,
  });

  const calculateFee = useCallback(
    async (values: FormValues, gasPriorityFee: GasProrityFee) => {
      if (!isSupported) return;

      if (!validateFormValues(values)) return;

      try {
        setIsLoadingFee(true);

        const feeData = await provider.getFeeData();
        const { value, to, maxPriorityFeePerGas, maxFeePerGas } = prepareValuesToSend(values, gasPriorityFee, feeData);
        const estimatedGas = await provider.estimateGas({
          value,
          to,
        });
        const estimatedFee = estimatedGas * (feeData.gasPrice! + maxPriorityFeePerGas);
        const maxFee = estimatedGas * maxFeePerGas;

        setCommission({
          estimated: parseUnits(estimatedFee.toString(), 'wei').toString(),
          max: parseUnits(maxFee.toString(), 'wei').toString(),
        });
      } catch (e) {
        console.error('debug-error', e);
        toast.error('Get commission error');
      } finally {
        setIsLoadingFee(false);
      }
    },
    [isSupported, provider]
  );

  const debouncedCalculateFee = useDebounce(calculateFee, 500);

  const send = async () => {
    if (!isSupported) return;

    if (!validateFormValues(values)) return;

    try {
      setIsLoadingSend(true);

      const feeData = await provider.getFeeData();
      const { value, to, maxPriorityFeePerGas, maxFeePerGas } = prepareValuesToSend(values, gasPriorityFee, feeData);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        value,
        to,
        maxPriorityFeePerGas,
        maxFeePerGas,
      });
      const txReciept = await tx.wait();

      updateBalance();
      toast.success(`You have successfully sent the coins. Tx hash: ${txReciept?.hash}`, { autoClose: false });
    } catch (e) {
      const message = (e as MetamaskError).info.error.message;

      toast.error(message);
    } finally {
      setIsLoadingSend(false);
    }
  };

  useEffect(() => {
    debouncedCalculateFee(values, gasPriorityFee);
  }, [debouncedCalculateFee, values, gasPriorityFee]);

  useEffect(() => {
    if (!isOpen && !isLoadingSend) {
      setValues(initialValues);
      setCommission({ estimated: '', max: '' });
    }
  }, [isOpen, setValues, isLoadingSend]);

  if (!(isConnected && isSupportedChain)) return;

  return (
    <Dialog.Root onOpenChange={setIsOpen} open={isOpen}>
      <Dialog.Trigger>
        <Button size="3">Send coin</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Send coin</Dialog.Title>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <Flex direction="column" gap="4">
            <Dialog.Description>Send ETH coin to another wallet address</Dialog.Description>
            <TextField.Input
              value={values.to}
              onChange={handleChange}
              name="to"
              id="to"
              size="3"
              placeholder="Wallet address"
            />
            <TextField.Input
              value={values.amount}
              onChange={handleChange}
              name="amount"
              id="amount"
              size="3"
              placeholder="Amount"
            />

            <Flex direction="column" gap="3">
              <Flex align="center" gap="2">
                <RadioGroup.Root id="priority" name="priority" onChange={handleChange} value={values.priority}>
                  {['slow', 'avg', 'fast'].map((p) => (
                    <label key={p}>
                      <Flex align="center" gap="2">
                        <RadioGroup.Item id="priority" onClick={handleChange} value={p} /> {p}
                      </Flex>
                    </label>
                  ))}
                </RadioGroup.Root>
              </Flex>
              <TextField.Input
                onChange={handleChange}
                value={values.customFee}
                name="customFee"
                id="customFee"
                size="3"
                placeholder="Custom priority fee"
              />
            </Flex>
            <Flex direction="column">
              <Text>Estimated commission: ~{formatEther(commission.estimated || '0')} ETH</Text>
              <Text>Max commission: ~{formatEther(commission.max || '0')} ETH</Text>
            </Flex>
            <Flex gap="2">
              <Dialog.Close>
                <Button disabled={isLoadingSend} style={{ flexGrow: 1 }} variant="outline" size="3">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button disabled={isLoadingFee || isLoadingSend} style={{ flexGrow: 1 }} size="3">
                Send
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

const prepareValuesToSend = (values: FormValues, gasPriorityFee: GasProrityFee, feeData: FeeData) => {
  const estimatedPriorityFee = BigInt(gasPriorityFee.priorityFees[values.priority]);
  const maxPriorityFeePerGas = Number(values.customFee) ? parseEther(String(values.customFee)) : estimatedPriorityFee;

  return {
    value: parseEther(String(values.amount)).toString(),
    to: getAddress(values.to),
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas: feeData.gasPrice! * 2n + BigInt(maxPriorityFeePerGas),
  };
};

const validateFormValues = (form: FormValues): boolean => {
  if (!isAddress(form.to)) return false;

  if (!Number(form.amount)) return false;

  return Boolean(Number(form.customFee)) || Boolean(form.priority);
};

export default SendCoin;
