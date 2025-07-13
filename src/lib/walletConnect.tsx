import React, { type ReactNode } from 'react';
import { createAppKit } from '@reown/appkit/react';

import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { arbitrum, mainnet } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Replace with your actual Project ID
const projectId = 'be181770445c4fc15c70da027d287221';

// 2. Metadata
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://evm-app.vercel.app/',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
};

// 3. Networks
const networks = [mainnet, arbitrum];

// 4. Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
});

// 5. Create AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true
  }
});

// ✅ Correct provider order: QueryClient → Wagmi → RainbowKit
export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <RainbowKitProvider chains={wagmiAdapter.chains}>
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
