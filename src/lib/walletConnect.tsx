
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import type { ReactNode } from 'react';
import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import type { Abi } from 'viem';
import ForumABI from '../../ForumABI.json'; // Import the ABI of the Forum contract
import { metaMask } from 'wagmi/connectors';
import { walletConnect } from 'wagmi/connectors';
// 1. React query client
const queryClient = new QueryClient();

// 2. Your Reown project ID
const projectId = 'be181770445c4fc15c70da027d287221';

// 3. App metadata
const metadata = {
  name: 'Web3 Forum',
  description: 'A decentralized forum on OP Sepolia Testnet',
  url: 'https://evm-app.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// 4. Define OP Sepolia Testnet
const opSepolia = defineChain({
  id: 11155420,
  name: 'OP Sepolia',
  network: 'op-sepolia',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://sepolia.optimism.io'] },
    public: { http: ['https://sepolia.optimism.io'] },
  },
  blockExplorers: {
    default: { name: 'OP Sepolia Explorer', url: 'https://sepolia-optimism.etherscan.io' },
  },
});

// 5. Declare networks array
const networks = [opSepolia] as [typeof opSepolia];

// 6. Initialize Adapter with contract configuration
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 7. Create Wagmi config with contract
const wagmiConfig = createConfig({
  chains: [opSepolia],
  transports: {
    [opSepolia.id]: http(),
  },
  connectors: [metaMask(), walletConnect({ projectId: '...' })]
});

// 8. Initialize AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: { analytics: true },
});

// 9. AppKitProvider
export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

// Export contract configuration for use in components
export const forumContract = {
  address: '0x82aFB7982C61F36B102234A46Ba2bb8bE8a0cb16' as `0x${string}`,
  abi: ForumABI as Abi,
};

export { wagmiConfig };