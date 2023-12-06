'use client';

import { Theme } from '@radix-ui/themes';
import { SWRConfig } from 'swr';

import { NewBlockListener } from '@/hocs';
import { appFetcher } from '@/shared';
import { useAppStore } from '@/store';

import '@radix-ui/themes/styles.css';
import '@/styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useAppStore();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SWRConfig value={{ fetcher: appFetcher }}>
          <NewBlockListener>
            <Theme appearance={theme}>{children}</Theme>
          </NewBlockListener>
        </SWRConfig>
      </body>
    </html>
  );
}
