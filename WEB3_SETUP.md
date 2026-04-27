# Backend Web3 Setup Instructions

## Environment Variables

Add these to your `.env` file:

```
# Blockchain RPC URLs
ETHEREUM_RPC_URL=https://rpc.ankr.com/eth_sepolia
POLYGON_RPC_URL=https://rpc.ankr.com/polygon

# Smart Contract Addresses (update after deployment)
USER_REGISTRY_ADDRESS=0x...
MARKETPLACE_ADDRESS=0x...

# Web3 Configuration
CHAIN_ID=11155111  # Sepolia testnet
```

## Frontend Web3 Setup

Add these to `.env.local`:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_USER_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x...
```

Get your WalletConnect Project ID from: https://cloud.walletconnect.com

## Smart Contracts

### Deployment

1. Install Hardhat:
```bash
npm install --save-dev hardhat
npx hardhat
```

2. Deploy contracts to testnet:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Contract Files
- `SPCUserRegistry.sol` - User registration on blockchain
- `SPCMarketplace.sol` - Buy/sell survey points with revenue sharing

## Backend Wallet Routes

Endpoints for wallet authentication:

- `GET /api/auth/wallet/:address` - Get nonce for signing
- `POST /api/auth/wallet/verify` - Verify signature and authenticate
- `POST /api/auth/wallet/link` - Link wallet to existing account

## Frontend Components

- `WalletConnect.tsx` - Connect/disconnect wallet UI
- `useRegisterUser()` - Hook to register user on-chain
- `usePurchasePoint()` - Hook to purchase survey points
- `useUploadPoint()` - Hook to upload survey points

## Testing

Use Sepolia testnet for testing:
- Faucet: https://sepoliafaucet.com
- Explorer: https://sepolia.etherscan.io

## Next Steps

1. Deploy contracts to Sepolia
2. Update contract addresses in environment files
3. Integrate wallet connect to auth pages
4. Test marketplace functionality
