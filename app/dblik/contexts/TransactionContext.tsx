import { initialize_transaction } from "@/clients/transaction_client"
import { generateSeedForCustomer, getKeypair } from "@/utils/transaction"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

type TransactionContextType = {
  tx: string
  initTransaction: () => Promise<void>
}
  
const TransactionContext = createContext<TransactionContextType>({
  tx: '',
  initTransaction: async () => {},
})

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({
    children
  }: {
    children: React.ReactNode
  }) => {
    const wallet = useWallet();
    const [tx, setTx] = useState('');
    const { connection } = useConnection();
  
    // todo: fix double requests

    const initTransaction = useCallback(async () => {
      if (wallet.publicKey == null) {
        setTx(''); 
        return
      }

      const keypair = getKeypair(generateSeedForCustomer(new Date()));
      const transaction = await initialize_transaction(connection, keypair, wallet);
      
      if (typeof(transaction) !== 'string') 
      {
        return
      }

      setTx(transaction);
    }, [wallet.publicKey])
  
    useEffect(() => {
      if(tx != '') return

      initTransaction()
    }, [initTransaction])
  
    return (
      <TransactionContext.Provider value={{ tx, initTransaction }}>
        {children}
      </TransactionContext.Provider>
    )
  }