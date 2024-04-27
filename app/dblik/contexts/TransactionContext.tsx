import { initialize_transaction } from "@/clients/transaction_client"
import { generateSeedForCustomer, getKeypair } from "@/utils/transaction"
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet"
import { AnchorWallet, useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react"
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
    const { publicKey } = useWallet();
    const [tx, setTx] = useState('');
    const {connection } = useConnection();
    const anchorWallet = useAnchorWallet() as AnchorWallet;
  
    const initTransaction = useCallback(async () => {
      if (publicKey == null) {
        setTx(''); 
        return
      }

      const keypair = getKeypair(generateSeedForCustomer(new Date()));
      const transaction = await initialize_transaction(connection, keypair, anchorWallet as NodeWallet);
      
      if (typeof(transaction) !== 'string')
      {
        return
      }
      

      setTx(transaction);
    }, [publicKey])
  
    useEffect(() => {
      if(tx != '')
        {
          return
        }

      initTransaction()
    }, [initTransaction])
  
    return (
      <TransactionContext.Provider value={{ tx, initTransaction }}>
        {children}
      </TransactionContext.Provider>
    )
  }