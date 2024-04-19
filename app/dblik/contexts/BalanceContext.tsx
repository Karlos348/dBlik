import { StaticWallet, provider } from "@/utils/anchor"
import { useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { createContext, useCallback, useContext, useEffect, useState } from "react"


type BalanceContextType = {
    balance: number
fetchBalance: () => Promise<void>
}
  
const BalanceContext = createContext<BalanceContextType>({
    balance: 0,
    fetchBalance: async () => {},
})

export const useBalance = () => useContext(BalanceContext);

export const BalanceProvider = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    //const { publicKey } = useWallet()
    const [balance, setBalance] = useState(0)
  
    const fetchBalance = useCallback(async () => {
      //if (!publicKey) return
      
      const playerBalance = await provider.connection.getBalance(StaticWallet.publicKey)
      setBalance(parseFloat((playerBalance / LAMPORTS_PER_SOL).toString()))
    }, [StaticWallet.publicKey])
  
    useEffect(() => {
      fetchBalance()
    }, [fetchBalance])
  
    return (
      <BalanceContext.Provider value={{ balance, fetchBalance }}>
        {children}
      </BalanceContext.Provider>
    )
  }