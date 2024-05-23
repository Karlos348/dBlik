import dynamic from "next/dynamic"

export const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
)

const WalletMultiButton = () => (
  <div className="button-container">
    <WalletMultiButtonDynamic/>
    <style jsx>{`
        .button-container {
          background-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          min-width: 50px;
        }
      `}</style>
  </div>
)

export default WalletMultiButton