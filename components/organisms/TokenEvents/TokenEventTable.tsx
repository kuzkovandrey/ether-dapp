import { ArrowBottomLeftIcon, ArrowBottomRightIcon } from '@radix-ui/react-icons';
import { Flex, Text, Tooltip } from '@radix-ui/themes';
import { useCallback, useEffect, useState } from 'react';

import { PaginationProps } from '@/components';
import { TokenTransferEvent } from '@/metamask/hooks';
import { formatHashToDisplay } from '@/shared';

import { Table, TableColumns } from '@/components/molecules';

type TokenEventTableProps = {
  events: Array<TokenTransferEvent>;
};

const LIMIT = 5;

function TokenEventTable({ events }: TokenEventTableProps) {
  const [pagination, setPagination] = useState<Pick<PaginationProps, 'page' | 'pages'>>({
    page: 1,
    pages: Math.ceil(events.length / LIMIT) || 1,
  });

  const onClickNext = useCallback(() => {
    setPagination((v) => ({ ...v, page: v.page + 1 }));
  }, []);

  const onClickPrev = useCallback(() => {
    setPagination((v) => ({ ...v, page: v.page - 1 }));
  }, []);

  useEffect(() => {
    setPagination((v) => ({ ...v, pages: Math.ceil(events.length / LIMIT) || 1 }));
  }, [events]);

  return (
    <Table<TokenTransferEvent>
      heading="Token events"
      data={events}
      columns={TABLE_COLUMNS}
      pagination={{
        rowsPerPage: LIMIT,
        ...pagination,
        onClickNext,
        onClickPrev,
      }}
    />
  );
}

const TABLE_COLUMNS: TableColumns<TokenTransferEvent> = [
  {
    key: 'from',
    title: 'From address',
    render: ({ from }) => (
      <Tooltip
        content={
          <Flex gap="1">
            <ArrowBottomLeftIcon /> {from}
          </Flex>
        }
      >
        <Text style={{ cursor: 'pointer' }} color="green" size="2">
          {formatHashToDisplay(from, 5, 4)}
        </Text>
      </Tooltip>
    ),
  },
  {
    key: 'to',
    title: 'To address',
    render: ({ to }) => (
      <Tooltip
        content={
          <Flex gap="1">
            <ArrowBottomRightIcon /> {to}
          </Flex>
        }
      >
        <Text style={{ cursor: 'pointer' }} color="green" size="2">
          {formatHashToDisplay(to, 5, 4)}
        </Text>
      </Tooltip>
    ),
  },
  {
    key: 'value',
    title: 'Value, wei',
    render: ({ value }) => <Text size="2">{value.toString()}</Text>,
  },
];

export default TokenEventTable;
