import { RawTransaction, getTransaction, map } from "@/clients/transaction_client"
import Transaction, { TransactionState } from "@/models/transaction"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair, PublicKey } from "@solana/web3.js"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

type TransactionContextType = {
  events: string[]
  code?: number
  account?: PublicKey
  transaction?: Transaction
  init: (code: number, event: string, keypair: Keypair) => Promise<void>
  update: (transaction: Transaction) => Promise<void>
  collectTransactionEvent: (event: string) => void
}

const TransactionContext = createContext<TransactionContextType>({
  events: [],
  init: async (code: number, event: string, keypair: Keypair) => {},
  update: async (transaction: Transaction) => {},
  collectTransactionEvent: (event: string) => {},
})

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({
    children
  }: {
    children: React.ReactNode
  }) => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [code, setCode] = useState<number>()
    const [events, setEvents] = useState<string[]>([]);
    const [account, setAccount] = useState<PublicKey>();
    const [transaction, setTransaction] = useState<Transaction>();
    const [isClient, setIsClient] = useState<boolean>(false);

    const init = useCallback(async (code: number, event: string, keypair: Keypair) => {
      setCode(code);
      setEvents(events.concat(event))
      setAccount(keypair.publicKey)
      setTransaction(new Transaction(keypair.publicKey, TransactionState.Initialized));

      const subscriptionId = connection.onAccountChange(keypair.publicKey, async (accountInfo) => {
        console.log('Account ' + keypair.publicKey.toString() + ' has changed. \n' + accountInfo);
        let account = await getTransaction(connection, keypair.publicKey);
        const transaction = map(account as RawTransaction);
        setTransaction(transaction)
    });
    }, [events])

    const collectTransactionEvent = useCallback(async (event: string) => {
      if(isClient)
      {
        setEvents(events.concat(event))
        console.log(events)
        let rawTransaction = await getTransaction(connection, account as PublicKey);
        const transaction = map(rawTransaction as RawTransaction);
        transaction.update(transaction.customer, transaction.state, transaction.timestamp, transaction.store, transaction.amount, transaction.message);
        setTransaction(transaction);
      }
      
    }, []);

    const update = useCallback(async () => {
      if(isClient)
      {
        let rawTransaction = await getTransaction(connection, account as PublicKey);
        const transaction = map(rawTransaction as RawTransaction);
        transaction.update(transaction.customer, transaction.state, transaction.timestamp, transaction.store, transaction.amount, transaction.message);
        setTransaction(transaction);
      }
      
    }, [events])

    useEffect(() => {
      setIsClient(true)

      // if(tx.length > 0) return

      //initTransaction()
    }, [init])

    return (
      <TransactionContext.Provider value={{ events, code, transaction, account, init, collectTransactionEvent, update } }>
        {children}
      </TransactionContext.Provider>
    )
  }