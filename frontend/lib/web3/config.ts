import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, polygon, polygonMumbai } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Project ID from WalletConnect Cloud (https://cloud.walletconnect.com)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId) {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect may not work properly.');
}

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, polygonMumbai],
  connectors: [
    injected(), // MetaMask and other injected wallets
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
  },
});

// Contract addresses (update with your deployed addresses)
export const contracts = {
  userRegistry: {
    address: (process.env.NEXT_PUBLIC_USER_REGISTRY_ADDRESS as `0x${string}`) || '0x',
    chain: sepolia.id,
  },
  marketplace: {
    address: (process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`) || '0x',
    chain: sepolia.id,
  },
};

// ABI exports for contracts
export const USER_REGISTRY_ABI = [
  {
    inputs: [{ internalType: 'string', name: '_username', type: 'string' }],
    name: 'registerUser',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_userAddress', type: 'address' }],
    name: 'getUser',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'walletAddress', type: 'address' },
          { internalType: 'string', name: 'username', type: 'string' },
          { internalType: 'uint256', name: 'registeredAt', type: 'uint256' },
          { internalType: 'uint256', name: 'pointsUploaded', type: 'uint256' },
          { internalType: 'uint256', name: 'totalEarnings', type: 'uint256' },
          { internalType: 'bool', name: 'isVerified', type: 'bool' },
        ],
        internalType: 'struct SPCUserRegistry.User',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_userAddress', type: 'address' }],
    name: 'isUserRegistered',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const MARKETPLACE_ABI = [
  {
    inputs: [
      { internalType: 'string', name: '_dataHash', type: 'string' },
      { internalType: 'uint256', name: '_price', type: 'uint256' },
    ],
    name: 'uploadPoint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_pointId', type: 'uint256' }],
    name: 'purchasePoint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;
