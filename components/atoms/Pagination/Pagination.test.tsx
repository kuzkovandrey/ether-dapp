/**
 * @jest-environment jsdom
 */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import Pagination, { PaginationProps } from './Pagination';

type OnClick = () => void;

afterEach(cleanup);

describe('Test Pagination component', () => {
  let onClickNext: OnClick;
  let onClickPrev: OnClick;
  let props: PaginationProps;

  beforeEach(() => {
    onClickNext = jest.fn();
    onClickPrev = jest.fn();
    props = {
      page: 1,
      pages: 5,
      onNext: onClickNext,
      onPrev: onClickPrev,
    };
  });

  test('# component should be rendered on the screen', () => {
    render(<Pagination {...props} />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  test('# component must have an initial state', () => {
    render(<Pagination {...props} />);

    const prevButton = screen.getByTestId('prev-button');
    const nextButton = screen.getByTestId('next-button');
    const displayPages = screen.getByTestId('pages-text');

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
    expect(displayPages).toHaveTextContent(/1 \/ 5/i);
  });

  test('# component state must be changed by button click', () => {
    const renderResult = render(<Pagination {...props} />);

    const prevButton = screen.getByTestId('prev-button');
    const nextButton = screen.getByTestId('next-button');
    const displayPages = screen.getByTestId('pages-text');

    // initial state, prev button is disabled
    repeat(() => fireEvent.click(prevButton), 3);
    expect(onClickPrev).toHaveBeenCalledTimes(0);

    fireEvent.click(nextButton);
    props.page = 2;
    renderResult.rerender(<Pagination {...props} />);
    expect(onClickNext).toHaveBeenCalledTimes(1);
    expect(displayPages).toHaveTextContent(/2 \/ 5/i);
    expect(prevButton).toBeEnabled();
    expect(nextButton).toBeEnabled();

    // last page
    repeat(() => fireEvent.click(nextButton), 3);

    props.page = 5;
    renderResult.rerender(<Pagination {...props} />);
    expect(onClickNext).toHaveBeenCalledTimes(4);
    expect(displayPages).toHaveTextContent(/5 \/ 5/i);
    expect(prevButton).toBeEnabled();
    expect(nextButton).toBeDisabled();

    repeat(() => fireEvent.click(nextButton), 3);

    expect(onClickNext).toHaveBeenCalledTimes(4);
  });
});

function repeat(func: () => unknown, count: number) {
  for (let i = 0; i < count; i++) {
    func();
  }
}
