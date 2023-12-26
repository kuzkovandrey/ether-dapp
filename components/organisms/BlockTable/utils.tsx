import { Link, Text } from '@radix-ui/themes';
import { formatUnits } from 'ethers';
import { ReactNode } from 'react';
import { urlJoin } from 'url-join-ts';

import { BLOCKCHAIN_EXPLORER_URL } from '@/shared';
import { Block } from '@/store';

import { NONE_VALUE } from '@/components/molecules';

type Keys = keyof Block;

export type FormattedBlock = Record<Keys, ReactNode>;

export function mapBlockToTable(block: Block): FormattedBlock {
  return {
    baseFee: (
      <Text weight="bold" size="1">
        {block.baseFee ? formatUnits(block.baseFee, 'gwei').toString() : NONE_VALUE}
      </Text>
    ),
    number: <Text size="1">{block.number}</Text>,
    gasLimit: <Text size="1">{formatUnits(block.gasLimit, 'gwei').toString()}</Text>,
    gasUsed: <Text size="1">{formatUnits(block.gasUsed, 'gwei').toString()}</Text>,
    hash: (
      <Text size="1" color="green">
        {block.hash ? (
          <Link target="_blank" color="green" href={urlJoin(BLOCKCHAIN_EXPLORER_URL, 'block', String(block.number))}>
            {block.hash.substring(0, 3) + '...' + block.hash.substring(block.hash.length - 5)}
          </Link>
        ) : (
          NONE_VALUE
        )}
      </Text>
    ),
    txCount: <Text size="1">{block.txCount}</Text>,
  };
}
