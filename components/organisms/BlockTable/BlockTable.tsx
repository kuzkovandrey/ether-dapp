'use client';

import { Flex, Heading, Table } from '@radix-ui/themes';
import { useId, useMemo } from 'react';

import { useBlockStore } from '@/store';

import { Pagination } from '@/components/atoms';

import { colums, FormattedBlock, mapBlockToTable, renderRowQueue } from './utils';

function BlockTable() {
  const { blocks, page, pages, limit, setPage } = useBlockStore();

  const displayBlocks = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const blockRange = blocks.slice(startIndex, startIndex + limit);

    return blockRange.map(mapBlockToTable);
  }, [blocks, page, limit]);

  const onClickNext = () => setPage(page + 1);
  const onClickPrev = () => setPage(page - 1);

  return (
    <Flex direction="column" gap="2">
      <Heading size="4">Latest blocks</Heading>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            {Object.values(colums).map((title) => (
              <Table.ColumnHeaderCell key={'title' + title}>{title}</Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {displayBlocks.map((block, key) => (
            <TableRow block={block} key={'block' + key} />
          ))}
        </Table.Body>
      </Table.Root>

      {Boolean(displayBlocks.length) && (
        <Pagination page={page} pages={pages} onNext={onClickNext} onPrev={onClickPrev} />
      )}
    </Flex>
  );
}

export function TableRow({ block }: { block: FormattedBlock }) {
  const id = useId();

  return (
    <Table.Row>
      {renderRowQueue.map((key) => (
        <Table.Cell key={`${key}${id}`}>{block[key]}</Table.Cell>
      ))}
    </Table.Row>
  );
}

export default BlockTable;
