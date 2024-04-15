import WalletContextProvider from "@/contexts/WalletContextProvider"
import dynamic from "next/dynamic"

export const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
)

const WalletMultiButton = () => {

  return (
  <WalletContextProvider>
    <WalletMultiButtonDynamic />
  </WalletContextProvider>
)}

export default WalletMultiButton