import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

type BalanceContextType = {
  balance?: number
}
  
const BalanceContext = createContext<BalanceContextType>({
})

export const useBalance = () => useContext(BalanceContext);

export const BalanceProvider = ({
    children
  }: {
    children: React.ReactNode
  }) => {
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState<number>();
    const { connection } = useConnection();
    const [subscriptionId, setSubscriptionId] = useState<number>();

    useEffect(() => {
      if(subscriptionId !== undefined) {
        connection.removeProgramAccountChangeListener(subscriptionId as number);
        setSubscriptionId(undefined);
      }

      if(publicKey === null) {
        setBalance(undefined);
        return;
      }

      connection.getBalance(publicKey).then(balance => setBalance(parseFloat((balance / LAMPORTS_PER_SOL).toString()))); 

      const subId = connection.onAccountChange(publicKey, async (accountInfo) => {
        setBalance(parseFloat((accountInfo.lamports / LAMPORTS_PER_SOL).toString()))
      }, 'confirmed');
  
      setSubscriptionId(subId);
    }, [publicKey])

    return (
      <BalanceContext.Provider value={{ balance }}>
        {children}
      </BalanceContext.Provider>
    )
  }