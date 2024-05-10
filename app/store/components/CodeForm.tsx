"suse client"
import { getTransaction } from '@/clients/transaction_client';
import { connection, program, programId, provider } from '@/utils/anchor';
import { generateSeedsForStore, getKeypair } from '@/utils/transaction';
import { roundDateForStore } from '@/utils/transaction_date';
import { BN, web3 } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { useState } from 'react';

export function CodeForm() {
  const [code, setCode] = useState('');


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const now = new Date();
    const seeds = generateSeedsForStore(Number(code), roundDateForStore(now));
    console.log(seeds);

    const keypairs = seeds.map(getKeypair);

    const transactionKeypairs = (await Promise.all(keypairs.map(async x => {
      const t = await getTransaction(provider, x.publicKey);
      return t !== null ? x : null;
    })))
    .filter(x => x !== null);
    
    if(transactionKeypairs.length > 1)
    {
      console.log('transactionKeypairs.length > 1')
      return;
    }
    
    if(transactionKeypairs.length == 0)
    {
      console.log('transactionKeypairs.length == 0')
      return;
    }

    const pubkey = transactionKeypairs[0]?.publicKey;

    const sampleAmount = 0.001 * web3.LAMPORTS_PER_SOL;
    const requestPaymentTx = await program.methods.requestPayment(new BN(sampleAmount), "d-"+new Date().toString())
        .accounts({
      signer: provider.publicKey,
      transaction: pubkey,
      systemProgram: programId,
    })
    .rpc();

    console.log(requestPaymentTx);

    
    console.log('code '+ code);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" name="code" value={code} onChange={e => setCode(e.target.value)} />
      <button type="submit">Send payment request</button>
    </form>
  );
}
