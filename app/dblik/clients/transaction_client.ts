import { INITIAL_ACCOUNT_SIZE, program, programId } from "@/utils/anchor";
import { web3 } from "@coral-xyz/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { u32, u8, struct, seq } from '@solana/buffer-layout';
import { u64, publicKey } from '@solana/buffer-layout-utils';
import Transaction from "@/models/transaction";

export async function getTransaction(connection: web3.Connection, account: PublicKey): Promise<RawTransaction | undefined> {

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

export async function initialize_transaction(
    connection: web3.Connection,
    accountKeypair: Keypair,
    payerWallet: WalletContextState): Promise<string | undefined> {
    const payerPubkey = payerWallet.publicKey ?? PublicKey.default;
    const requiredLamports = await connection.getMinimumBalanceForRentExemption(
        INITIAL_ACCOUNT_SIZE
    );

    let createAccountInstruction = web3.SystemProgram.createAccount({
        fromPubkey: payerPubkey,
        newAccountPubkey: accountKeypair.publicKey,
        lamports: requiredLamports,
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

    console.log("Account: https://explorer.solana.com/address/" + accountKeypair.publicKey + "?cluster=devnet\nTx: https://explorer.solana.com/tx/" + signature + "?cluster=devnet");

    return typeof signature === "string" ? signature : undefined;
}

export async function confirm_transaction(
    connection: web3.Connection,
    transactionPubkey: PublicKey,
    payerWallet: WalletContextState,
    storePubkey: PublicKey): Promise<string | undefined> {
    const payerPubkey = payerWallet.publicKey ?? PublicKey.default;

    const instruction = await program.methods.confirmTransaction()
        .accounts({
            signer: payerPubkey,
            transaction: transactionPubkey,
            store: storePubkey
        })
        .instruction();

    let blockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

    const messageV0 = new TransactionMessage({
        payerKey: payerPubkey,
        recentBlockhash: blockhash,
        instructions: [instruction]
    }).compileToV0Message();

    const tx = new VersionedTransaction(messageV0);

    const signature = await payerWallet.sendTransaction(tx, connection).catch(e => console.error(e));

    return typeof signature === "string" ? signature : undefined;;
}

export async function cancel_transaction(
    connection: web3.Connection,
    transactionPubkey: PublicKey,
    payerWallet: WalletContextState,
    storePubkey: PublicKey): Promise<string | undefined> {
    const payerPubkey = payerWallet.publicKey ?? PublicKey.default;

    const instruction = await program.methods.cancelTransaction()
        .accounts({
            signer: payerPubkey,
            transaction: transactionPubkey,
            store: storePubkey
        })
        .instruction();

    let blockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

    const messageV0 = new TransactionMessage({
        payerKey: payerPubkey,
        recentBlockhash: blockhash,
        instructions: [instruction]
    }).compileToV0Message();

    const tx = new VersionedTransaction(messageV0);

    const signature = await payerWallet.sendTransaction(tx, connection).catch(e => console.error(e));

    return typeof signature === "string" ? signature : undefined;
}

export async function close_transaction_account(
    connection: web3.Connection,
    transactionPubkey: PublicKey,
    payerWallet: WalletContextState): Promise<string | undefined> {
    const payerPubkey = payerWallet.publicKey ?? PublicKey.default;

    const instruction = await program.methods.closeTransactionAccount()
        .accounts({
            signer: payerPubkey,
            transaction: transactionPubkey
        })
        .instruction();

    let blockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

    const messageV0 = new TransactionMessage({
        payerKey: payerPubkey,
        recentBlockhash: blockhash,
        instructions: [instruction]
    }).compileToV0Message();

    const tx = new VersionedTransaction(messageV0);

    const signature = await payerWallet.sendTransaction(tx, connection).catch(e => console.error(e));

    return typeof signature === "string" ? signature : undefined;
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