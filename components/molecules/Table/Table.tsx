'use client';

import { UpdateIcon } from '@radix-ui/react-icons';
import { Flex, Heading, Table as RdxTable, Text } from '@radix-ui/themes';
import { ReactNode, useMemo } from 'react';

import { Pagination } from '@/components/atoms';

export const NONE_VALUE = '--';

export type TableColumn<D> = {
  key: keyof D extends string ? keyof D : never;
  title: ReactNode;
  render: (d: D) => ReactNode;
};

export type TableColumns<D> = Array<TableColumn<D>>;

export type PaginationProps = {
  page: number;
  pages: number;
  rowsPerPage: number;
  onClickNext: () => void;
  onClickPrev: () => void;
};

export type TableProps<D> = {
  heading: string;
  pagination: PaginationProps;
  data: Array<D>;
  columns: TableColumns<D>;
  isLoading?: boolean;
};

function Table<D>({ heading, data, pagination, columns, isLoading }: TableProps<D>) {
  if (!columns.length) {
    throw new Error('Columns is empty');
  }

  const displayData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.rowsPerPage;

    return data.slice(startIndex, startIndex + pagination.rowsPerPage);
  }, [data, pagination]);

  return (
    <Flex data-testid="table" direction="column" gap="2">
      <Flex gap="2" align="center">
        <Heading data-testid="table-heading" size="4">
          {heading}
        </Heading>

        {isLoading && (
          <Flex data-testid="table-loader">
            <UpdateIcon />
          </Flex>
        )}
      </Flex>

      {data.length ? (
        <RdxTable.Root variant="surface">
          <RdxTable.Header>
            <RdxTable.Row>
              {Object.values(columns).map(({ key, title }) => (
                <RdxTable.ColumnHeaderCell data-testid="table-header-cell" key={`${key}-hCell`}>
                  {title}
                </RdxTable.ColumnHeaderCell>
              ))}
            </RdxTable.Row>
          </RdxTable.Header>

          <RdxTable.Body>
            {Array.from(displayData).map((d, index) => (
              <RdxTable.Row data-testid="table-row" key={`${index}-bodyRow`}>
                {columns.map((column, index) => (
                  <RdxTable.Cell key={`${index}-cell`}>{column.render(d)}</RdxTable.Cell>
                ))}
              </RdxTable.Row>
            ))}
          </RdxTable.Body>
        </RdxTable.Root>
      ) : (
        <Flex data-testid="table-nothing-found">
          <Text>Nothing found</Text>
        </Flex>
      )}
      {Boolean(data.length) && (
        <div data-testid="table-pagination">
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            onNext={pagination.onClickNext}
            onPrev={pagination.onClickPrev}
          />
        </div>
      )}
    </Flex>
  );
}

export default Table;
