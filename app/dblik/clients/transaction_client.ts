import { INITIAL_ACCOUNT_SIZE, program, programId } from "@/utils/anchor";
import { web3 } from "@coral-xyz/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";

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