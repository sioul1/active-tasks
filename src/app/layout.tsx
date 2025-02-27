import '@/styles/globals.css';

import { PropsWithChildren } from 'react';

import AppProvider from '@/components/app-provider';
import { Toaster } from '@/components/ui/toaster';

import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Tasks Active',
  description: 'Portfolio Project',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
