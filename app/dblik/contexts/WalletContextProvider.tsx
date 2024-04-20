import { useMemo } from "react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
  ConnectionProvider, 
  WalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { CoinbaseWalletAdapter, PhantomWalletAdapter, TrustWalletAdapter } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import React from "react"
require("@solana/wallet-adapter-react-ui/styles.css")

const WalletContextProvider = ({ children }: { children: React.ReactNode }) => 
{
    const network = WalletAdapterNetwork.Devnet
    const endpoint = useMemo(() => clusterApiUrl(network), [network])

    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
        new CoinbaseWalletAdapter(),
        new TrustWalletAdapter()
    ], [network]
    )

    return (
<ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
            {children}
        </WalletModalProvider>
    </WalletProvider>
</ConnectionProvider>
  )
}

export default WalletContextProvider