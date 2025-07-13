import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { mainnet, arbitrum } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import type { ReactNode } from 'react';

// 1. QueryClient setup
const queryClient = new QueryClient();

// 2. Replace with your actual Project ID
const projectId = 'be181770445c4fc15c70da027d287221';

// 3. Metadata
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://evm-app.vercel.app/',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// 4. Networks
const networks = [mainnet, arbitrum] as [typeof mainnet, typeof arbitrum];

// 5. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 6. Init AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
});

// 7. AppKitProvider with correct order
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
