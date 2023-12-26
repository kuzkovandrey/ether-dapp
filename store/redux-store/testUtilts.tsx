import { render, type RenderOptions } from '@testing-library/react';
import { PropsWithChildren, ReactElement } from 'react';
import { Provider } from 'react-redux';

import { store } from './store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {}

function Wrapper({ children }: PropsWithChildren) {
  return <Provider store={store}>{children}</Provider>;
}

export function renderWithProviders(ui: ReactElement, renderOptions: ExtendedRenderOptions = {}) {
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
