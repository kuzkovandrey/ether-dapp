import { GasProrityFee } from '@/helpers';

export function formatGasProrityFee({ baseFeePerGas, priorityFees }: GasProrityFee): GasProrityFee {
  const formattedPriorityFees = Object.fromEntries(
    Object.entries(priorityFees).map(([key, value]) => [key, parseFloat(value).toFixed(6)])
  ) as GasProrityFee['priorityFees'];

  return {
    baseFeePerGas: parseFloat(baseFeePerGas).toFixed(6),
    priorityFees: formattedPriorityFees,
  };
}
