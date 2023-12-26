/**
 * @jest-environment jsdom
 */

import { act, cleanup, screen } from '@testing-library/react';
import { parseUnits } from 'ethers';

import { setGasPriorityFee } from '@/store/redux-store/gasProrityFee';
import { renderWithProviders } from '@/store/redux-store/testUtilts';

import '@testing-library/jest-dom';
import GasTracker, { calculateTotalFee, formatBase, formatPriorityFee } from './GasTracker';

afterEach(cleanup);

describe('GasTracker component', () => {
  test('# component should be rendered on the screen', () => {
    renderWithProviders(<GasTracker />);
    expect(screen.getByTestId('gas-tracker')).toBeInTheDocument();
    expect(screen.getAllByTestId('gas-estimation').length).toBe(3);
  });

  test('# component must display store values', () => {
    const { store } = renderWithProviders(<GasTracker />);

    const getState = () => store.getState().gasPriorityFee.gasPriorityFee;

    const testDisplayValues = () => {
      const priorityEntries = Object.entries(getState().priorityFees);

      const priorityElements = screen.getAllByTestId('gas-estimation-priority');
      const totalFeeElements = screen.getAllByTestId('gas-estimation-total-fee');
      const baseElements = screen.getAllByTestId('gas-estimation-base');
      const priorityFeeElements = screen.getAllByTestId('gas-estimation-priority-fee');

      priorityEntries.forEach(([priority, priorityFee], index) => {
        expect(priorityElements[index]).toHaveTextContent(priority);
        expect(totalFeeElements[index]).toHaveTextContent(calculateTotalFee(getState().baseFeePerGas, priorityFee));
        expect(baseElements[index]).toHaveTextContent(formatBase(getState().baseFeePerGas));
        expect(priorityFeeElements[index]).toHaveTextContent(formatPriorityFee(priorityFee));
      });
    };

    testDisplayValues();

    act(() =>
      store.dispatch(
        setGasPriorityFee({
          baseFeePerGas: parseUnits('123', 'gwei').toString(),
          priorityFees: {
            slow: parseUnits('0.1', 'gwei').toString(),
            avg: parseUnits('1.1', 'gwei').toString(),
            fast: parseUnits('2.2', 'gwei').toString(),
          },
        })
      )
    );

    testDisplayValues();

    act(() =>
      store.dispatch(
        setGasPriorityFee({
          baseFeePerGas: parseUnits('121', 'gwei').toString(),
          priorityFees: {
            slow: parseUnits('0.771', 'gwei').toString(),
            avg: parseUnits('3.1235', 'gwei').toString(),
            fast: parseUnits('7.32123', 'gwei').toString(),
          },
        })
      )
    );

    testDisplayValues();
  });
});
