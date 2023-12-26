/**
 * @jest-environment jsdom
 */

import { cleanup, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import NetworkInfo, { NetworkInfoProps } from './NetworkInfo';

afterEach(cleanup);

describe('NetworkInfo component', () => {
  let props = {} as NetworkInfoProps;

  beforeEach(() => {
    props = {
      name: 'Eth mainnet',
      isConnected: false,
    };
  });

  test('# component should be rendered on the screen', () => {
    render(<NetworkInfo {...props} />);
    expect(screen.getByTestId('network-info')).toBeInTheDocument();
    expect(screen.getByTestId('network-info-heading')).toHaveTextContent(`Network: ${props.name}`);
  });

  test('# component must show connection status', () => {
    const { rerender } = render(<NetworkInfo {...props} />);

    expect(screen.getByTestId('network-info-badge')).toHaveTextContent(`Not connected`);

    props.isConnected = true;
    rerender(<NetworkInfo {...props} />);
    expect(screen.getByTestId('network-info-badge')).toHaveTextContent(`Connected`);
  });

  test('# component must have action contect', () => {
    const { rerender } = render(<NetworkInfo {...props} />);

    expect(screen.queryByTestId('network-info-action-slot')).not.toBeInTheDocument();

    props.actionSlot = <p>Action</p>;
    rerender(<NetworkInfo {...props} />);
    expect(screen.queryByTestId('network-info-action-slot')).toBeInTheDocument();
    expect(screen.queryByTestId('network-info-action-slot')).toMatchSnapshot();
  });
});
