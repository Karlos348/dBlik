import { RawTransaction, confirm_transaction, getTransaction, initialize_transaction, map } from "@/clients/transaction_client"
import Transaction, { TransactionState } from "@/models/transaction"
import { generateCode } from "@/utils/code"
import { generateSeedForCustomer, getKeypair } from "@/utils/transaction"
import { roundDateForCustomer } from "@/utils/transaction_date"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

type TransactionContextType = {
  code?: number
  transaction?: Transaction
  init: () => Promise<void>
  confirm: () => Promise<void>
  cancel: () => Promise<void>,
  closeTransaction: () => Promise<void>
}

const TransactionContext = createContext<TransactionContextType>({
  init: async () => {},
  confirm: async () => {},
  cancel: async () => {},
  closeTransaction: async () => {}
})

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({
    children
  }: {
    children: React.ReactNode
  }) => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [subscriptionId, setSubscriptionId] = useState<number>();
    const [code, setCode] = useState<number>();
    const [account, setAccount] = useState<PublicKey>();
    const [transaction, setTransaction] = useState<Transaction>();

    const init = useCallback(async () => {
      const code = generateCode();
      const now = new Date();
      const roundedDate = roundDateForCustomer(now);
      const seed = generateSeedForCustomer(code, roundedDate);
      const keypair = getKeypair(seed);

      const signature = await initialize_transaction(connection, keypair, wallet);

      setCode(code);
      setAccount(keypair.publicKey)
      setTransaction(new Transaction(keypair.publicKey, TransactionState.Initialized));

      const subscriptionId = connection.onAccountChange(keypair.publicKey, async (accountInfo) => {
        console.log('Account ' + keypair.publicKey.toString() + ' has changed. \n' + accountInfo);
        await update(keypair.publicKey);
      });
      
      setSubscriptionId(subscriptionId);
  }, [connection, wallet]);

    const confirm = async () => {
      await confirm_transaction(connection, account as PublicKey, wallet, transaction?.store ?? PublicKey.default);
    };

    const cancel = async () => {
      // todo
    };

    const closeTransaction = async () => {
      // todo
      connection.removeProgramAccountChangeListener(subscriptionId as number)
    };

    const update = async (account: PublicKey) => {
        let rawTransaction = await getTransaction(connection, account as PublicKey);
        console.log(rawTransaction)
        const transaction = map(rawTransaction as RawTransaction);
        transaction.update(transaction.customer, transaction.state, transaction.timestamp, transaction.store, transaction.amount, transaction.message);
        setTransaction(transaction);
        console.log(transaction);
       };

    return (
      <TransactionContext.Provider value={{ code, transaction, init, confirm, cancel, closeTransaction } }>
        {children}
      </TransactionContext.Provider>
    )
  }