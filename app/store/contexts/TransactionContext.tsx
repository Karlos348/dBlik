import { generateSeedForCustomer, getKeypair } from "@/utils/transaction"
import { roundDateForCustomer } from "@/utils/transaction_date"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

type TransactionContextType = {
  keypair: string | null
  code: number | null
  productId: number | null
  state: TransactionState
  isClient: boolean
  selectProduct: (productId) => Promise<void>
  requestPayment: (code) => Promise<void>
}

enum TransactionState {
  New,
  Initialized
}
  
const TransactionContext = createContext<TransactionContextType>({
  keypair: null,
  code: null,
  productId: 13,
  state: TransactionState.New,
  isClient: false,
  selectProduct: async (productId) => {},
  requestPayment: async (code) => {},
})

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({
    children
  }: {
    children: React.ReactNode
  }) => {
    
    const [isClient, setIsClient] = useState(false)
    const [code, setCode] = useState<number | null>(null)
    const [productId, setProductId] = useState<number | null>(null)

    const selectProduct = useCallback(async (productId) => {
      setProductId(productId)
      console.log('productId: '+ productId)
    }, [code])

    const requestPayment = useCallback(async (code) => {
      setCode(code)
      console.log('code: '+ code)
    }, [code])
  
    useEffect(() => {
      setProductId(productId)
      setCode(code)
      setIsClient(true)
    }, [])

    return (
      <TransactionContext.Provider value={{ keypair: null, code, productId, selectProduct, requestPayment, state: TransactionState.Initialized, isClient } }>
        {children}
      </TransactionContext.Provider>
    )
  }
  