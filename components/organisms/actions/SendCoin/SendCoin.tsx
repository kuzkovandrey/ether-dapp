'use client';

import { Button, Dialog, Flex, RadioGroup, Text, TextField } from '@radix-ui/themes';
import { formatEther, parseUnits } from 'ethers';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { GasProrityFee } from '@/helpers';
import { useDebounce } from '@/hooks';
import { getMetamastError } from '@/metamask';
import { useMetamaskAccountProvider, useMetamaskProvider } from '@/metamask/providers';
import { calculateTimeDifference } from '@/shared';
import { useAppSelector } from '@/store/redux-store';

import { FormValues, initialValues, prepareValuesToSend, validateFormValues } from './utils';

const { start, stop } = calculateTimeDifference();

function SendCoin() {
  const { provider, isSupported } = useMetamaskProvider();
  const { isConnected, isSupportedChain, updateBalance } = useMetamaskAccountProvider();
  const { gasPriorityFee } = useAppSelector((store) => store.gasPriorityFee);

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
        const { message, code } = getMetamastError(e);

        toast.error(`${code}: ${message}`);
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

      start();

      const txReciept = await tx.wait();

      updateBalance();
      toast.success(`You have successfully sent the coins. Tx hash: ${txReciept?.hash}. Time: ${stop()}`, {
        autoClose: false,
      });
    } catch (e) {
      const { message, code } = getMetamastError(e);

      toast.error(`${code}: ${message}`);
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
              placeholder="Amount, ETH"
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
                placeholder="Custom priority fee, GWEI"
              />
            </Flex>
            <Flex direction="column">
              <Text>Estimated commission: ~{formatEther(commission.estimated || '0')} ETH</Text>
              <Text>Max possible commission: ~{formatEther(commission.max || '0')} ETH</Text>
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

export default SendCoin;
