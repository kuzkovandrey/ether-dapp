/**
 * @jest-environment jsdom
 */

import { cleanup, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import Table, { TableProps } from './Table';

afterEach(cleanup);

type TestData = {
  field1: string;
  field2: number;
  field3: string;
};

const mockData: TestData[] = [
  { field1: 'field11', field2: 21, field3: '31' },
  { field1: 'field12', field2: 22, field3: '32' },
  { field1: 'field13', field2: 23, field3: '33' },
];

describe('Table component', () => {
  let initialProps = {} as TableProps<TestData>;

  beforeEach(() => {
    initialProps = {
      heading: 'Heading text',
      pagination: {
        page: 1,
        pages: 1,
        rowsPerPage: 5,
        onClickNext: jest.fn(),
        onClickPrev: jest.fn(),
      },
      isLoading: false,
      data: [],
      columns: [
        {
          key: 'field1',
          title: 'field title',
          render: ({ field1 }) => <>{field1}</>,
        },
        {
          key: 'field2',
          title: <div>field2 title</div>,
          render: ({ field2 }) => <div>{field2}</div>,
        },
        {
          key: 'field3',
          title: <p>field3 title</p>,
          render: ({ field3 }) => <p>{field3}</p>,
        },
      ],
    };
  });

  test('# empty component should be rendered on the screen', () => {
    render(<Table {...initialProps} />);
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByTestId('table-heading')).toHaveTextContent(initialProps.heading);
    expect(screen.getByTestId('table-nothing-found')).toHaveTextContent(/Nothing found/i);
    expect(screen.queryByTestId('table-loader')).not.toBeInTheDocument();
    expect(screen.queryByTestId('table-pagination')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('table-header-cell').length).toBe(0);
    expect(screen.queryAllByTestId('table-row').length).toBe(0);
  });

  test('# component must have header cells with text content', () => {
    initialProps.data = mockData;
    render(<Table {...initialProps} />);

    const cells = screen.getAllByTestId('table-header-cell');

    expect(cells.length).toBe(initialProps.columns.length);
    cells.forEach((cell) => expect(cell).toMatchSnapshot());
  });

  test('# component must have loader', () => {
    const { rerender } = render(<Table {...initialProps} />);

    expect(screen.queryByTestId('table-loader')).not.toBeInTheDocument();

    initialProps.isLoading = true;
    rerender(<Table {...initialProps} />);
    expect(screen.getByTestId('table-loader')).toBeInTheDocument();
  });

  test('# component must have data content', () => {
    initialProps.data = mockData;
    const { rerender } = render(<Table {...initialProps} />);

    expect(screen.getAllByTestId('table-row').length).toBe(mockData.length);
    expect(screen.queryByTestId('table-nothing-found')).not.toBeInTheDocument();

    initialProps.data = [...mockData, ...mockData];
    rerender(<Table {...initialProps} />);

    const rows = screen.getAllByTestId('table-row');

    expect(rows.length).toBe(initialProps.pagination.rowsPerPage);
    rows.forEach((row) => expect(row).toMatchSnapshot());
  });
});
