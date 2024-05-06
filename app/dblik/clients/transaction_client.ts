import { INITIAL_ACCOUNT_SIZE, program, programId, provider } from "@/utils/anchor";
import { web3 } from "@coral-xyz/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { u32, u8, struct, seq } from '@solana/buffer-layout';
import { u64, publicKey} from '@solana/buffer-layout-utils';

export async function getTransaction(connection: web3.Connection, account: PublicKey) {
    const acc = await provider.connection.getAccountInfo(account);

    if(acc == null)
    {
        return;
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

export async function initialize_transaction(
    connection: web3.Connection,
    accountKeypair: Keypair,
    payerWallet: WalletContextState) : Promise<string | void>
{
    const payerPubkey = payerWallet.publicKey ?? PublicKey.default;

    let createAccountInstruction = web3.SystemProgram.createAccount({
        fromPubkey: payerPubkey,
        newAccountPubkey: accountKeypair.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(
            INITIAL_ACCOUNT_SIZE
        ),
        space: INITIAL_ACCOUNT_SIZE,
        programId: programId
    });

    const initTransactionInstruction = await program.methods.initTransaction()
    .accounts({
        signer: payerPubkey,
        transaction: accountKeypair.publicKey,
        systemProgram: web3.SystemProgram.programId
    })
    .signers([accountKeypair])
    .instruction();

    let blockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

    const messageV0 = new TransactionMessage({
        payerKey: payerPubkey,
        recentBlockhash: blockhash,
        instructions: [createAccountInstruction, initTransactionInstruction]
    }).compileToV0Message();

    const tx = new VersionedTransaction(messageV0);
    [accountKeypair].forEach(s => tx.sign([s]));

    const signature = await payerWallet.sendTransaction(tx, connection).catch(e => console.error(e));

    console.log("Account: https://explorer.solana.com/address/"+accountKeypair.publicKey+"?cluster=devnet\nTx: https://explorer.solana.com/tx/"+signature+"?cluster=devnet");

    return signature;
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