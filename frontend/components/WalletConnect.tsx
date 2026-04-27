'use client';

import { useConnect, useDisconnect, useAccount } from 'wagmi';
import { useState } from 'react';
import styles from './WalletConnect.module.css';

export default function WalletConnect() {
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId);
    if (connector) {
      connect({ connector });
      setIsOpen(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className={styles.walletConnected}>
        <span className={styles.address}>{formatAddress(address)}</span>
        <button
          onClick={() => disconnect()}
          className={styles.disconnectBtn}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className={styles.walletContainer}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.connectBtn}
      >
        Connect Wallet
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleConnect(connector.id)}
              className={styles.connectorBtn}
            >
              {connector.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
