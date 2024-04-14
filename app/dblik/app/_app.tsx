import WalletContextProvider from "../contexts/WalletContextProvider"
import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
  return (
      <WalletContextProvider>
            <Component {...pageProps} />
      </WalletContextProvider>
  )
}