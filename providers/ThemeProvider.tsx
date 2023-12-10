import { Theme } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';

import { useAppStore } from '@/store';

function ThemeProvider({ children }: PropsWithChildren) {
  const { theme } = useAppStore();

  return <Theme appearance={theme}>{children}</Theme>;
}

export default ThemeProvider;
