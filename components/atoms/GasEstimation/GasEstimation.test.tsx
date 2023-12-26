/**
 * @jest-environment jsdom
 */

import { cleanup, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import GasEstimation, { GasEstimationProps } from './GasEstimation';

afterEach(cleanup);

describe('GasEstimation component', () => {
  let props = {} as GasEstimationProps;

  beforeEach(() => {
    props = {
      priority: 'avg',
      base: '100',
      priorityFee: '2',
      totalFee: '102',
    };
  });

  test('# component should be rendered on the screen', () => {
    render(<GasEstimation {...props} />);
    expect(screen.getByTestId('gas-estimation')).toBeInTheDocument();
    expect(screen.getByTestId('gas-estimation-priority')).toHaveTextContent(props.priority);
    expect(screen.getByTestId('gas-estimation-total-fee')).toHaveTextContent(props.totalFee);
    expect(screen.getByTestId('gas-estimation-base')).toHaveTextContent(props.base);
    expect(screen.getByTestId('gas-estimation-priority-fee')).toHaveTextContent(props.priorityFee);
  });
});
