import { INITIAL_ACCOUNT_SIZE, program, programId } from "@/utils/anchor";
import { Provider, web3 } from "@coral-xyz/anchor";
import { Keypair, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { u32, u8, struct, seq } from '@solana/buffer-layout';
import { u64, publicKey} from '@solana/buffer-layout-utils';

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

export interface RawTransaction {
    discriminator: bigint;
    customer: PublicKey;
    timestamp: number;
    state: number;
    store: PublicKey;
    amount: number;
    message: number[]
  }