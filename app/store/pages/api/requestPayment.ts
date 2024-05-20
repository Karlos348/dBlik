import { getTransaction } from "@/clients/transaction_client";
import { get_program } from "@/utils/anchor";
import { generateSeedsForStore, getKeypair } from "@/utils/transaction";
import { roundDateForStore } from "@/utils/transaction_date";
import { AnchorProvider, BN, web3 } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";

export default async function handler(req, res) {

    const { code, amount, message } = req.body;

    const connection = new Connection(clusterApiUrl("devnet"), {
        commitment: "confirmed",
    });
    const wallet = new NodeWallet(Keypair.fromSecretKey(Uint8Array.from(process.env.STORE_KEYPAIR?.split(',').map(x => parseInt(x)) as number[])));
    const provider = new AnchorProvider(connection, wallet, {
        commitment: "confirmed",
    });

    const now = new Date();
    const seeds = generateSeedsForStore(code, roundDateForStore(now));
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
      // todo
      return;
    }
    
    if(transactionKeypairs.length == 0)
    {
      console.log('transactionKeypairs.length == 0')
      // todo
      return;
    }

    const pubkey = transactionKeypairs[0]?.publicKey;

    const program = get_program(provider);
    const requestPaymentTx = await program.methods.requestPayment(new BN(amount), message)
        .accounts({
      signer: provider.publicKey,
      transaction: pubkey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
    
    res.status(200).json(requestPaymentTx);
  }