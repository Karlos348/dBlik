import { useTransaction } from '@/contexts/TransactionContext';
import { RawTransaction, getTransaction, initialize_transaction, map } from '@/clients/transaction_client';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { generateCode } from '@/utils/code';
import { generateSeedForCustomer, getKeypair } from '@/utils/transaction';
import { roundDateForCustomer } from '@/utils/transaction_date';

export function GenerateCodeButton() {
  const { code, init, update } = useTransaction();
  const wallet = useWallet();

  const { connection } = useConnection();


  const handleSubmit = async (e: any) => {
    if (wallet.publicKey == null) {
        return
      }

      const code = generateCode();
      const now = new Date();
      const roundedDate = roundDateForCustomer(now);
      const seed = generateSeedForCustomer(code, roundedDate);
      const keypair = getKeypair(seed);

      const subscriptionId = connection.onAccountChange(keypair.publicKey, async (accountInfo) => {
        console.log('Account ' + keypair.publicKey.toString() + ' has changed. \n' + accountInfo);
        let account = await getTransaction(connection, keypair.publicKey);
        const transaction = map(account as RawTransaction);
        console.log(transaction)
        await update(transaction.state ?? null);
      });

      const transaction = await initialize_transaction(connection, keypair, wallet);
      
      init(code, transaction as string, keypair);

      console.log('subscriptionId: ' + subscriptionId)
  };

  return (
    <>
      {code === null
        ? <div><button onClick={handleSubmit}>generate code</button></div>
        : <div></div>
        }
    </>
  );
}
