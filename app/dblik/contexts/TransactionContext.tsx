import { getTransaction, initialize_transaction } from "@/clients/transaction_client"
import { TransactionState } from "@/models/transaction"
import { generateCode } from "@/utils/code"
import { generateSeedForCustomer, getKeypair } from "@/utils/transaction"
import { roundDateForCustomer } from "@/utils/transaction_date"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair, PublicKey } from "@solana/web3.js"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

type TransactionContextType = {
  tx: string[]
  code: number | null
  account: PublicKey | null
  state: TransactionState | null
  isClient: boolean
  init: (code: number, transaction: string, keypair: Keypair) => Promise<void>
  update: (state: TransactionState | null) => Promise<void>
}

const TransactionContext = createContext<TransactionContextType>({
  tx: [],
  code: null,
  account: null,
  state: null,
  isClient: false,
  init: async (code: number, transaction: string, keypair: Keypair) => {},
  update: async (state: TransactionState | null) => {}
})

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({
    children
  }: {
    children: React.ReactNode
  }) => {
    const wallet = useWallet();
    const [tx, setTx] = useState<string[]>([]);
    const {connection} = useConnection();
    const [isClient, setIsClient] = useState(false)
    const [code, setCode] = useState<number | null>(null)
    const [state, setState] = useState<TransactionState | null>(null)
    const [account, setAccount] = useState<PublicKey | null>(null)

    const init = useCallback(async (code: number, transaction: string, keypair: Keypair) => {
      setTx([]);
      setCode(code);
      setTx(tx.concat([transaction]));
      setState(TransactionState.Initialized);
      setAccount(keypair.publicKey)
    }, [wallet.publicKey])

    const update = useCallback(async (state: TransactionState | null) => {
      setState(state);
    }, [wallet.publicKey])


    useEffect(() => {
      setIsClient(true)

      if(tx.length > 0) return

      //initTransaction()
    }, [init])

    

    return (
      <TransactionContext.Provider value={{ tx, code, account, init, state, isClient, update } }>
        {children}
      </TransactionContext.Provider>
    )
  }