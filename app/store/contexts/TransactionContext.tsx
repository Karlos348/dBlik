import { getTransaction, map, requestPayment as client_requestPayment } from "@/clients/transaction_client"
import Product from "@/models/product"
import Transaction, { TransactionState } from "@/models/transaction"
import { Cluster, Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { setInterval } from "timers"

type TransactionContextType = {
  code?: number
  transaction?: Transaction
  product?: Product
  account?: PublicKey
  error?: string
  selectProduct: (product: Product) => Promise<void>
  requestPayment: (code: string) => Promise<void>
  complete: () => Promise<void>
}

const TransactionContext = createContext<TransactionContextType>({
  selectProduct: async (product) => { },
  requestPayment: async (code) => { },
  complete: async () => { }
})

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({
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

  const requestPayment = useCallback(async (code_in) => {
      setCode(code_in)

      if(product === undefined) {
        return;
      }

      const pubkey = await client_requestPayment(code_in, product);
      setAccount(pubkey);

      if(pubkey === undefined) {
        setError("invalid code")
        setCode(undefined);
        setTimeout(() => setError(undefined), 2000);
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
    <TransactionContext.Provider value={{ code, transaction, product, account, error, requestPayment, complete, selectProduct }}>
      {children}
    </TransactionContext.Provider>
  )
}