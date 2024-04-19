import { provider } from "@/utils/anchor"
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
    const { publicKey } = useWallet()
    const [balance, setBalance] = useState(0)
  
    // Fetch balances
    const fetchBalance = useCallback(async () => {
      if (!publicKey) return
      
      const playerBalance = await provider.connection.getBalance(publicKey)
      setBalance(parseFloat((playerBalance / LAMPORTS_PER_SOL).toFixed(1)))
    }, [publicKey])
  
    // Effect to fetch balance when the component mounts
    useEffect(() => {
      fetchBalance()
    }, [fetchBalance])
  
    return (
      <BalanceContext.Provider value={{ balance, fetchBalance }}>
        {children}
      </BalanceContext.Provider>
    )
  }