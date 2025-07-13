import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { mainnet, arbitrum } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import type { ReactNode } from 'react';

// 1. React query client
const queryClient = new QueryClient();

// 2. Your Reown project ID
const projectId = 'be181770445c4fc15c70da027d287221';

// 3. App metadata
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://evm-app.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// 4. Declare networks array with correct type
const networks = [mainnet, arbitrum] as [typeof mainnet, typeof arbitrum];

// 5. Initialize Adapter
const wagmiAdapter = new WagmiAdapter({ networks, projectId, ssr: true });

// 6. Initialize AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: { analytics: true },
});

// 7. AppKitProvider
export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}