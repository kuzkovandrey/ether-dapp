'use client';

import { Flex, Heading, Table as RdxTable } from '@radix-ui/themes';
import { ReactNode, useMemo } from 'react';

import { Pagination } from '@/components/atoms';

export type TableColumn<D> = {
  key: keyof D extends string ? keyof D : never;
  title: ReactNode;
  render: (d: D) => ReactNode;
};

export type TableColumns<D> = Array<TableColumn<D>>;

export const NONE_VALUE = '--';

export type TableProps<D> = {
  heading: string;
  pagination: {
    page: number;
    pages: number;
    rowsPerPage: number;
    onClickNext: () => void;
    onClickPrev: () => void;
  };
  data: Array<D>;
  columns: TableColumns<D>;
  rowsPerPage?: number;
};

function Table<D>({ heading, data, pagination, columns }: TableProps<D>) {
  const displayData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.rowsPerPage;

    return data.slice(startIndex, startIndex + pagination.rowsPerPage);
  }, [data, pagination]);

  return (
    <Flex direction="column" gap="2">
      <Heading size="4">{heading}</Heading>
      <RdxTable.Root variant="surface">
        <RdxTable.Header>
          <RdxTable.Row>
            {Object.values(columns).map(({ key, title }) => (
              <RdxTable.ColumnHeaderCell key={`${key}-hCell`}>{title}</RdxTable.ColumnHeaderCell>
            ))}
          </RdxTable.Row>
        </RdxTable.Header>

        <RdxTable.Body>
          {Array.from(displayData).map((d, index) => (
            <RdxTable.Row key={`${index}-bodyRow`}>
              {columns.map((column, index) => (
                <RdxTable.Cell key={`${index}-cell`}>{column.render(d)}</RdxTable.Cell>
              ))}
            </RdxTable.Row>
          ))}
        </RdxTable.Body>
      </RdxTable.Root>

      {Boolean(data.length) && (
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          onNext={pagination.onClickNext}
          onPrev={pagination.onClickPrev}
        />
      )}
    </Flex>
  );
}

export default Table;
