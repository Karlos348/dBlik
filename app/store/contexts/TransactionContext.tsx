import { generateSeedForCustomer, getKeypair } from "@/utils/transaction"
import { roundDateForCustomer } from "@/utils/transaction_date"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

type TransactionContextType = {
  keypair: string | null
  code: number | null
  state: TransactionState
  isClient: boolean
  requestPayment: (x) => Promise<void>
}

enum TransactionState {
  New,
  Initialized
}
  
const TransactionContext = createContext<TransactionContextType>({
  keypair: null,
  code: null,
  state: TransactionState.New,
  isClient: false,
  requestPayment: async (x) => {},
})

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({
    children
  }: {
    children: React.ReactNode
  }) => {
    
    const [isClient, setIsClient] = useState(false)
    const [code, setCode] = useState<number | null>(null)

    const requestPayment = useCallback(async (x) => {
      setCode(x)
      console.log('code changed: '+ x)
    }, [code])
  
    useEffect(() => {
      setCode(code)
      setIsClient(true)
    }, [])

    return (
      <TransactionContext.Provider value={{ keypair: null, code, requestPayment, state: TransactionState.Initialized, isClient } }>
        {children}
      </TransactionContext.Provider>
    )
  }
  