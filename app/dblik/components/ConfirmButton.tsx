import { useTransaction } from '@/contexts/TransactionContext';
import { PublicKey } from '@solana/web3.js';
import { confirm_transaction, getTransaction } from '@/clients/transaction_client';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TransactionState } from '@/models/transaction';

export function ConfirmButton() {
  const { transaction, account, update, collectTransactionEvent } = useTransaction();
  const wallet = useWallet();
  const { connection } = useConnection();

  const pubkey = account ?? PublicKey.default;

  const handleSubmit = async (e: any) => {

    const transaction = await getTransaction(connection, pubkey);
    const tx = await confirm_transaction(connection, pubkey, wallet, transaction?.store ?? PublicKey.default);

    collectTransactionEvent(tx as string);
    
    console.log('[confirm transaction] tx: ' + tx);
  };


  return (
    <>
      {transaction?.state === TransactionState.Pending
        ? <div><button onClick={handleSubmit}>confirm transaction</button></div>
        : <div></div>
        }
    </>
  );
}
