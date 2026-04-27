import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { USER_REGISTRY_ABI, MARKETPLACE_ABI, contracts } from './config';

/**
 * Hook to register a new user on the blockchain
 */
export function useRegisterUser() {
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const registerUser = (username: string) => {
    writeContract({
      address: contracts.userRegistry.address,
      abi: USER_REGISTRY_ABI,
      functionName: 'registerUser',
      args: [username],
    });
  };

  return {
    registerUser,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  };
}

/**
 * Hook to check if user is registered
 */
export function useIsUserRegistered(userAddress?: `0x${string}`) {
  const { data: isRegistered, isLoading } = useReadContract({
    address: contracts.userRegistry.address,
    abi: USER_REGISTRY_ABI,
    functionName: 'isUserRegistered',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    isRegistered: isRegistered as boolean,
    isLoading,
  };
}

/**
 * Hook to get user details
 */
export function useGetUser(userAddress?: `0x${string}`) {
  const { data: user, isLoading } = useReadContract({
    address: contracts.userRegistry.address,
    abi: USER_REGISTRY_ABI,
    functionName: 'getUser',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    user: user as any,
    isLoading,
  };
}

/**
 * Hook to upload a survey point
 */
export function useUploadPoint() {
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const uploadPoint = (dataHash: string, price: bigint) => {
    writeContract({
      address: contracts.marketplace.address,
      abi: MARKETPLACE_ABI,
      functionName: 'uploadPoint',
      args: [dataHash, price],
    });
  };

  return {
    uploadPoint,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  };
}

/**
 * Hook to purchase a survey point
 */
export function usePurchasePoint() {
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const purchasePoint = (pointId: bigint, value: bigint) => {
    writeContract({
      address: contracts.marketplace.address,
      abi: MARKETPLACE_ABI,
      functionName: 'purchasePoint',
      args: [pointId],
      value,
    });
  };

  return {
    purchasePoint,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  };
}
