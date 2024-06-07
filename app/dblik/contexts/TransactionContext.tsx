import { RawTransaction, cancel_transaction, close_transaction_account, confirm_transaction, getTransaction, initialize_transaction, map } from "@/clients/transaction_client"
import Transaction, { TransactionState } from "@/models/transaction"
import { TRANSACTION_EXPIRATION_TIME_IN_SECONDS } from "@/utils/anchor"
import { generateCode } from "@/utils/code"
import { generateSeedForCustomer, getKeypair } from "@/utils/transaction"
import { roundDateForCustomer } from "@/utils/transaction_date"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

type TransactionContextType = {
  code?: number
  timeLeft: number
  transaction?: Transaction
  init: () => Promise<void>
  confirm: () => Promise<void>
  cancel: () => Promise<void>,
  closeTransactionAccount: () => Promise<void>
}

const TransactionContext = createContext<TransactionContextType>({
  timeLeft: TRANSACTION_EXPIRATION_TIME_IN_SECONDS,
  init: async () => { },
  confirm: async () => { },
  cancel: async () => { },
  closeTransactionAccount: async () => { }
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
  const [timeLeft, setTimeLeft] = useState(TRANSACTION_EXPIRATION_TIME_IN_SECONDS);
  const [timerId, setTimerId] = useState<NodeJS.Timeout>();
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

    const subId = connection.onAccountChange(keypair.publicKey, async (accountInfo) => {
      console.log('Account ' + keypair.publicKey.toString() + ' has changed. \n' + accountInfo);
      await update(keypair.publicKey);
    }, 'confirmed');

    setSubscriptionId(subId);
  }, [connection, wallet]);

  const confirm = async () => {
    await confirm_transaction(connection, account as PublicKey, wallet, transaction?.store ?? PublicKey.default);
  };

  const cancel = async () => {
    await cancel_transaction(connection, account as PublicKey, wallet, transaction?.store ?? PublicKey.default);
  };

  const closeTransactionAccount = async () => {
    await close_transaction_account(connection, account as PublicKey, wallet);
    connection.removeAccountChangeListener(subscriptionId as number)
    restart()
  };

  const update = async (account: PublicKey) => {
    let rawTransaction = await getTransaction(connection, account as PublicKey);
    console.log(rawTransaction)
    const transaction = map(rawTransaction as RawTransaction);
    transaction.update(transaction.customer, transaction.state, transaction.timestamp, transaction.store, transaction.amount, transaction.message);
    setTransaction(transaction);
    console.log(transaction);
  };

  const restart = () => {
    if(timerId !== undefined) {
        clearInterval(timerId)
    }
    setSubscriptionId(undefined);
    setCode(undefined);
    setTimeLeft(TRANSACTION_EXPIRATION_TIME_IN_SECONDS);
    setTimerId(undefined);
    setAccount(undefined);
    setTransaction(undefined);
    
  };

  useEffect(() => {
    if(code === undefined) {
      return;
    }

    const updateTimer = () => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    };

    const intervalId = setInterval(updateTimer, 1000);
    setTimerId(intervalId)
    return () => clearInterval(intervalId);
  }, [code]);

  useEffect(() => {
    if(timeLeft === 0) {
      clearInterval(timerId)
      closeTransactionAccount()
    }

  }, [timeLeft])

  useEffect(() => {
    if([TransactionState.Pending, TransactionState.Initialized, undefined].includes(transaction?.state)) {
      return;
    }

    closeTransactionAccount();
  }, [transaction]);

  return (
    <TransactionContext.Provider value={{ code, transaction, timeLeft, init, confirm, cancel, closeTransactionAccount }}>
      {children}
    </TransactionContext.Provider>
  )
}