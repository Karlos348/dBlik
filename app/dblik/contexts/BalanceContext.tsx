import { initialize_transaction } from "@/clients/transaction_client"
import { programId, provider } from "@/utils/anchor"
import { generateSeedForCustomer, getKeypair } from "@/utils/transaction"
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react"
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
  
    const fetchBalance = useCallback(async () => {
      if (publicKey == null) {
        setBalance(0); 
        return
      }
      const balance = await connection.getBalance(publicKey, { commitment: 'confirmed'})
      setBalance(parseFloat((balance / LAMPORTS_PER_SOL).toString()))


      const keypair = getKeypair(generateSeedForCustomer(new Date()));
      await initialize_transaction(connection, programId, keypair, /* todo: import wallet */);
    }, [publicKey])
  
    useEffect(() => {
      fetchBalance()
    }, [fetchBalance])
  
    return (
      <BalanceContext.Provider value={{ balance, fetchBalance }}>
        {children}
      </BalanceContext.Provider>
    )
  }