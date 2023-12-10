'use client';

import '@radix-ui/themes/styles.css';
import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import Providers from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
