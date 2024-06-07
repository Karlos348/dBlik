import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { u32, u8, struct, seq } from '@solana/buffer-layout';
import { u64, publicKey } from '@solana/buffer-layout-utils';
import Transaction from "@/models/transaction";
import Product from "@/models/product";

export async function requestPayment(code: string, product: Product): Promise<PublicKey | undefined> {

    const response = await fetch('/api/requestPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: Number(code),
          amount: (product?.price ?? 0) * LAMPORTS_PER_SOL,
          message: product?.name ?? ''
        }),
      });

      if(response.ok) {
        return new PublicKey(await response.json());
      }

      return undefined;
}

export async function getTransaction(connection: Connection, account: PublicKey): Promise<RawTransaction | undefined> {

    const acc = await connection.getAccountInfo(account, 'confirmed');
    if (acc == null) {
        return undefined;
    }

    const data = struct<RawTransaction>([
        u64('discriminator'),
        publicKey('customer'),
        u64('timestamp'),
        u8('state'),
        publicKey('store'),
        u64('amount'),
        u32('string-prefix'),
        seq(u8(), acc.data.byteLength - 93, "message")
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

export function map(transaction: RawTransaction): Transaction {
    return new Transaction(transaction?.customer,
        transaction?.state,
        transaction?.timestamp,
        transaction?.store,
        transaction?.amount,
        String.fromCharCode(...removeTrailingZeros(transaction?.message ?? "")));
}

function removeTrailingZeros(arr: number[]): number[] {
    let endIndex = arr.length;

    while (endIndex > 0 && arr[endIndex - 1] === 0) {
        endIndex--;
    }

    return arr.slice(0, endIndex);
}