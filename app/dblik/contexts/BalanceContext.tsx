import { useConnection, useWallet } from "@solana/wallet-adapter-react"
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
    children
  }: {
    children: React.ReactNode
  }) => {
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState(0);
    const {connection } = useConnection();
    const [isClient, setIsClient] = useState<boolean>(false);

    const fetchBalance = useCallback(async () => {
      if(!isClient) return;

      if (publicKey == null) {
        setBalance(0); 
        return
      }
      
      const balance = await connection.getBalance(publicKey, { commitment: 'confirmed'})
      setBalance(parseFloat((balance / LAMPORTS_PER_SOL).toString()))
    }, [publicKey])

    useEffect(() => {
      setIsClient(true)
      fetchBalance()
    }, [fetchBalance])

    setInterval(() => {
        fetchBalance()
    }, 10000);
  
    return (
      <BalanceContext.Provider value={{ balance, fetchBalance }}>
        {children}
      </BalanceContext.Provider>
    )
  }