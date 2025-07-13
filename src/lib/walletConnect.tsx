import { createAppKit, type AppKitNetwork } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { mainnet, arbitrum } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import type { ReactNode } from 'react';

// ✅ QueryClient setup
const queryClient = new QueryClient();

// ✅ Use your real project ID
const projectId = 'be181770445c4fc15c70da027d287221';

// ✅ App metadata
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://evm-app.vercel.app/',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// ✅ Correct typing for networks array
const networks = [mainnet, arbitrum] as [AppKitNetwork, ...AppKitNetwork[]];

// ✅ Initialize WagmiAdapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// ✅ Initialize AppKit
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: { analytics: true },
});

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <RainbowKitProvider chains={wagmiAdapter.wagmiConfig.chains}>
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
