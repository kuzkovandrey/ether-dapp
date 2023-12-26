'use client';

import { Text } from '@radix-ui/themes';
import { formatUnits } from 'ethers';
import { useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/redux-store';
import { type Block, setPage } from '@/store/redux-store/blocks';

import { NONE_VALUE, Table, TableColumns } from '@/components/molecules';

function BlockTable() {
  // const { blocks, page, pages, limit, setPage } = useBlockStore();
  const { blocks, page, pages, limit, isLoading } = useAppSelector((store) => store.blocks);
  const dispatch = useAppDispatch();

  const paginationProps = useMemo(
    () => ({
      page,
      pages,
      rowsPerPage: limit,
      onClickNext: () => dispatch(setPage(page + 1)),
      onClickPrev: () => dispatch(setPage(page - 1)),
    }),
    [setPage, page, pages, limit]
  );

  return (
    <Table<Block>
      heading="Latest blocks"
      isLoading={isLoading}
      data={blocks}
      pagination={paginationProps}
      columns={TABLE_COLUMNS}
    />
  );
}

const TABLE_COLUMNS: TableColumns<Block> = [
  {
    key: 'number',
    title: 'Number',
    render: ({ number }) => <Text size="1">{number}</Text>,
  },
  {
    key: 'hash',
    title: 'Hash',
    render: ({ hash }) => (
      <Text size="1" color="green">
        {hash ? (
          <Text color="green">{hash.substring(0, 3) + '...' + hash.substring(hash.length - 5)}</Text>
        ) : (
          NONE_VALUE
        )}
      </Text>
    ),
  },
  {
    key: 'txCount',
    title: 'Txn',
    render: ({ txCount }) => <Text size="1">{txCount}</Text>,
  },
  {
    key: 'gasLimit',
    title: 'Gas Limit',
    render: ({ gasLimit }) => <Text size="1">{formatUnits(gasLimit, 'gwei').toString()}</Text>,
  },
  {
    key: 'gasUsed',
    title: 'Gas Used',
    render: ({ gasUsed }) => <Text size="1">{formatUnits(gasUsed, 'gwei').toString()}</Text>,
  },
  {
    key: 'baseFee',
    title: 'Base fee, gwei',
    render: ({ baseFee }) => (
      <Text weight="bold" size="1">
        {baseFee ? formatUnits(baseFee, 'gwei').toString() : NONE_VALUE}
      </Text>
    ),
  },
];

export default BlockTable;
