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
import { PublicKey, clusterApiUrl } from "@solana/web3.js"
require("@solana/wallet-adapter-react-ui/styles.css")

const WalletContextProvider: FC/*function component*/<{ children: ReactNode }> = ({ children }) => {

  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  let [state, setState] = useState({
    pk: PublicKey.default,
    balance: 0
})

  const wallets = useMemo(
    () => [
        new PhantomWalletAdapter(),
        new CoinbaseWalletAdapter(),
        new TrustWalletAdapter()
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default WalletContextProvider