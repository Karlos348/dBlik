import { useTransaction } from '@/contexts/TransactionContext';
import { PublicKey } from '@solana/web3.js';
import { confirm_transaction, getTransaction } from '@/clients/transaction_client';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export function ConfirmButton() {
  const transaction = useTransaction();
  const wallet = useWallet();
  const { connection } = useConnection();

  const pubkey = transaction.account ?? PublicKey.default;

  const handleSubmit = async (e: any) => {

    const transaction = await getTransaction(connection, pubkey);
    const tx = await confirm_transaction(connection, pubkey, wallet, transaction?.store ?? PublicKey.default);
    
    console.log('[confirm transaction] tx: ' + tx);
  };

  return (
    <>
      {transaction.account === null
        ? <div></div>
        : <div><button onClick={handleSubmit}>confirm transaction</button></div>
        }
    </>
  );
}
