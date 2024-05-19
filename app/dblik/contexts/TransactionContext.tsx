import { initialize_transaction } from "@/clients/transaction_client"
import { generateCode } from "@/utils/code"
import { generateSeedForCustomer, getKeypair } from "@/utils/transaction"
import { roundDateForCustomer } from "@/utils/transaction_date"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

type TransactionContextType = {
  tx: string | null
  code: number | null
  account: PublicKey | null
  state: TransactionState
  isClient: boolean
  initTransaction: () => Promise<void>
}

enum TransactionState {
  New,
  Initialized
}

  
const TransactionContext = createContext<TransactionContextType>({
  tx: null,
  code: null,
  account: null,
  state: TransactionState.New,
  isClient: false,
  initTransaction: async () => {},
})

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({
    children
  }: {
    children: React.ReactNode
  }) => {
    const wallet = useWallet();
    const [tx, setTx] = useState<string | null>(null);
    const { connection } = useConnection();
    const [isClient, setIsClient] = useState(false)
    const [code, setCode] = useState<number | null>(null)
    const [state, setState] = useState<TransactionState>(TransactionState.New)
    const [account, setAccount] = useState<PublicKey | null>(null)

    const initTransaction = useCallback(async () => {
      if (wallet.publicKey == null) {
        setTx(null); 
        return
      }

      const code = generateCode();
      const now = new Date();
      const roundedDate = roundDateForCustomer(now);
      const seed = generateSeedForCustomer(code, roundedDate);
      const keypair = getKeypair(seed);

      const transaction = await initialize_transaction(connection, keypair, wallet);
      
      if (typeof(transaction) !== 'string') 
      {
        return
      }

      setCode(code);
      setTx(transaction);
      setState(TransactionState.Initialized);
      setAccount(keypair.publicKey)

      const subscriptionId = connection.onAccountChange(keypair.publicKey, (accountInfo) => {
        console.log('Account ' + keypair.publicKey.toString() + ' changed. \n' + accountInfo);
      });
      console.log('subscriptionId: ' + subscriptionId)
    }, [wallet.publicKey])
  
    useEffect(() => {
      setIsClient(true)

      if(tx != null) return

      initTransaction()
    }, [initTransaction])

    return (
      <TransactionContext.Provider value={{ tx, code, account, initTransaction, state, isClient } }>
        {children}
      </TransactionContext.Provider>
    )
  }