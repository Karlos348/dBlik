import { generateSeedForCustomer, getKeypair } from "@/utils/transaction"
import { roundDateForCustomer } from "@/utils/transaction_date"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

type TransactionContextType = {
  tx: string | null
  code: number | null
  state: TransactionState
  isClient: boolean
  requestPayment: () => Promise<void>
}

enum TransactionState {
  New,
  Initialized
}
  
const TransactionContext = createContext<TransactionContextType>({
  tx: null,
  code: null,
  state: TransactionState.New,
  isClient: false,
  requestPayment: async () => {},
})

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({
    children
  }: {
    children: React.ReactNode
  }) => {
    
    const [isClient, setIsClient] = useState(false)

    const requestPayment = useCallback(async () => {
    }, [])
  
    useEffect(() => {
      setIsClient(true)

      requestPayment()
    }, [requestPayment])

    return (
      <TransactionContext.Provider value={{ tx: null, code: null, requestPayment, state: TransactionState.Initialized, isClient } }>
        {children}
      </TransactionContext.Provider>
    )
  }