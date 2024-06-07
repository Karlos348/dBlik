import Product from "@/models/product"
import { generateSeedForCustomer, getKeypair } from "@/utils/transaction"
import { roundDateForCustomer } from "@/utils/transaction_date"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

type TransactionContextType = {
  keypair: string | null
  code: number | null
  product: Product | null,
  state?: TransactionState
  isClient: boolean
  selectProduct: (product) => Promise<void>
  requestPayment: (code) => Promise<void>
}

enum TransactionState {
  Initialized,
  Pending,
  Succeed,
  Timeout,
  Canceled
}
  
const TransactionContext = createContext<TransactionContextType>({
  keypair: null,
  code: null,
  product: null,
  isClient: false,
  selectProduct: async () => {},
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
    const [product, setProduct] = useState<Product | null>(null)

    const selectProduct = useCallback(async (product) => {
      setProduct(product)
      console.log('productId: '+ product?.id)
    }, [product])

    const requestPayment = useCallback(async (code) => {
      setCode(code)
      console.log('code: '+ code)
    }, [code])
  
    useEffect(() => {
      setProduct(product)
      setCode(code)
      setIsClient(true)
    }, [])

    return (
      <TransactionContext.Provider value={{ keypair: null, code, product: product, selectProduct, requestPayment, state: TransactionState.Initialized, isClient } }>
        {children}
      </TransactionContext.Provider>
    )
  }
  