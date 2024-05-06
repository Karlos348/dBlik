import { getTransaction } from '@/clients/transaction_client';
import { connection, program, programId } from '@/utils/anchor';
import { generateSeedsForStore, getKeypair } from '@/utils/transaction';
import { roundDateForStore } from '@/utils/transaction_date';
import { BN, web3 } from '@coral-xyz/anchor';
import { useState } from 'react';

export function CodeForm() {
  const [code, setCode] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const now = new Date();
    const seeds = generateSeedsForStore(Number(code), roundDateForStore(now));
    console.log(seeds);

    const keypairs = seeds.map(getKeypair);
    const transactions = keypairs.map(async x => await getTransaction(connection, x.publicKey));
    console.log(transactions);

    const sampleAmount = 0.001 * web3.LAMPORTS_PER_SOL;
    const requestPaymentTx = await program.methods.requestPayment(new BN(sampleAmount), "d-"+new Date().toString())
        .accounts({
      signer: process.env.STORE_KEYPAIR,
      transaction: // todo),
      systemProgram: programId,
    })
    .rpc()

    console.log(code);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" name="code" value={code} onChange={e => setCode(e.target.value)} />
      <button type="submit">Send payment request</button>
    </form>
  );
}
