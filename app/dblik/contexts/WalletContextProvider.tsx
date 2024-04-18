import { FC, ReactNode, useMemo, useState } from "react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
  ConnectionProvider, 
  WalletProvider,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { CoinbaseWalletAdapter, LedgerWalletAdapter, PhantomWalletAdapter, TrustWalletAdapter } from "@solana/wallet-adapter-wallets"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import React from "react"
require("@solana/wallet-adapter-react-ui/styles.css")


const WalletContextProvider = ({ children }: { children: React.ReactNode }) => 
{
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const wallets = useMemo(
    () => [
        new PhantomWalletAdapter(),
        new CoinbaseWalletAdapter(),
        new TrustWalletAdapter()
    ],
    [network]
  )

  const [resources, setResources] = useState<{
    connection: Connection
    publicKey: PublicKey | null
  }>();

  const todo = async () => {
    if (resources?.publicKey != null) 
        return;

    setResources({
      connection: useConnection().connection,
      publicKey: useWallet().publicKey
    });
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default WalletContextProvider