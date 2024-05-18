import { BN, Provider, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { u32, u8, struct, seq } from '@solana/buffer-layout';
import { u64, publicKey} from '@solana/buffer-layout-utils';
import { generateSeedsForStore, getKeypair } from "@/utils/transaction";
import { get_program, get_provider, programId } from "@/utils/anchor";
import { roundDateForStore } from "@/utils/transaction_date";

export async function getTransaction(provider: Provider, account: PublicKey) : Promise<RawTransaction | null> 
{
    const acc = await provider.connection.getAccountInfo(account);
    if(acc == null)
    {
        return null;
    }
  
    const data = struct<RawTransaction>([
        u64('discriminator'),
        publicKey('customer'),
        u64('timestamp'),
        u8('state'),
        publicKey('store'),
        u64('amount'),
        u32('string-prefix'),
        seq(u8(), acc.data.byteLength-93, "message")
    ]).decode(acc.data);
    
    return data;
}

export async function requestPayment(code: number, amount: number, message: string) : Promise<string | undefined>
{
    const now = new Date();
    const seeds = generateSeedsForStore(code, roundDateForStore(now));
    console.log(seeds);

    const keypairs = seeds.map(getKeypair);

    const provider = get_provider(process);
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

    return requestPaymentTx;
}

export interface RawTransaction {
    discriminator: bigint;
    customer: PublicKey;
    timestamp: number;
    state: number;
    store: PublicKey;
    amount: number;
    message: number[]
  }