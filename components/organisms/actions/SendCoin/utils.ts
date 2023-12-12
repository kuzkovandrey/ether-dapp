import { FeeData, getAddress, isAddress, parseEther, parseUnits } from 'ethers';

import { GasProrityFee, Priority } from '@/helpers';
import { getGasPriceByPriority } from '@/shared';

export type FormValues = {
  to: string;
  amount: string;
  customFee: string;
  priority: Priority;
};

export const initialValues: FormValues = {
  to: '',
  amount: '',
  customFee: '',
  priority: 'slow',
};

export const prepareValuesToSend = (values: FormValues, gasPriorityFee: GasProrityFee, feeData: FeeData) => {
  const estimatedPriorityFee = BigInt(gasPriorityFee.priorityFees[values.priority]);
  const maxPriorityFeePerGas = Number(values.customFee) ? parseUnits(values.customFee, 'gwei') : estimatedPriorityFee;

  return {
    value: parseEther(String(values.amount)).toString(),
    to: getAddress(values.to),
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    maxFeePerGas: getGasPriceByPriority(feeData.gasPrice!, values.priority) + BigInt(maxPriorityFeePerGas),
  };
};

export const validateFormValues = (form: FormValues): boolean => {
  if (!isAddress(form.to)) return false;

  if (!Number(form.amount)) return false;

  return Boolean(Number(form.customFee)) || Boolean(form.priority);
};
