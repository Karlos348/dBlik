import { getTransaction, map, requestPayment as client_requestPayment } from "@/clients/transaction_client"
import Product from "@/models/product"
import Transaction, { TransactionState } from "@/models/transaction"
import { Cluster, Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { setInterval } from "timers"

type TransactionContextType2 = {
  code?: number
  transaction?: Transaction
  product?: Product
  account?: PublicKey
  error?: string
  selectProduct: (product: Product) => Promise<void>
  requestPayment: (code: string) => Promise<void>
  complete: () => Promise<void>
}

const TransactionContext2 = createContext<TransactionContextType2>({
  selectProduct: async (product) => { },
  requestPayment: async (code) => { },
  complete: async () => { }
})

export const useTransaction2 = () => useContext(TransactionContext2);

export const TransactionProvider2 = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [subscriptionId, setSubscriptionId] = useState<number>();
  const [account, setAccount] = useState<PublicKey>();
  const [code, setCode] = useState<number>();
  const [product, setProduct] = useState<Product>();
  const [transaction, setTransaction] = useState<Transaction>();
  const [error, setError] = useState<string>();
  const [connection, setConnection] = useState(new Connection(clusterApiUrl(process.env.CLUSTER as Cluster)));

  const requestPayment = useCallback(async (code) => {
      setCode(code)

      if(product === undefined) {
        return;
      }

      const pubkey = await client_requestPayment(code, product);
      setAccount(pubkey);

      if(pubkey === undefined) {
        setError("invalid code")
        setCode(undefined);
        setInterval(() => setError(undefined), 2000);
        return;
      }

      const subId = connection.onAccountChange(pubkey, async (accountInfo) => {
        console.log('Account ' + pubkey.toString() + ' has changed. \n' + accountInfo);
        await update(pubkey);
      }, 'confirmed');
  
      setSubscriptionId(subId);
      update(pubkey)
  }, [code, product])

  const complete = async () => {
    setProduct(undefined);
    setAccount(undefined);
    setTransaction(undefined);
    setCode(undefined)
    setError(undefined)

    if(subscriptionId === undefined) {
        return;
    }

    await connection.removeAccountChangeListener(subscriptionId)
    setSubscriptionId(undefined)
  };

  const update = async (account: PublicKey) => {
    const rawTransaction = await getTransaction(connection, account);
    if(rawTransaction === undefined) {
        return;
    }

    const t = map(rawTransaction);
    setTransaction(t);
  };

  const selectProduct = useCallback(async (p: Product) => {
    if(product === undefined) {
        setProduct(p)
    }
    
  }, [product])

  useEffect(() => {
    if([TransactionState.Succeed, TransactionState.Canceled, TransactionState.Timeout, undefined].includes(transaction?.state) && subscriptionId !== undefined) {
        connection.removeAccountChangeListener(subscriptionId as number)
        setSubscriptionId(undefined)
    }
  }, [transaction])

  return (
    <TransactionContext2.Provider value={{ code, transaction, product, account, error, requestPayment, complete, selectProduct }}>
      {children}
    </TransactionContext2.Provider>
  )
}