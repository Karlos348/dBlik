import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Wallet } from "@coral-xyz/anchor/dist/cjs/provider"
import { Dblik } from "../target/types/dblik";
import * as web3 from "@solana/web3.js";
import { sha256 } from '@noble/hashes/sha256';
import * as token from "@solana/spl-token";
import { assert } from "chai";
import { Keypair, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { BN } from "bn.js";
import { publicKey, u64, bool, u128 } from '@solana/buffer-layout-utils';
import { u32, u8, struct, cstr, utf8, seq, u48 } from '@solana/buffer-layout';

const provider = anchor.AnchorProvider.env();
console.log("wallet public key: ", provider.wallet.publicKey);
anchor.setProvider(provider);
const user = provider.wallet;
const program = anchor.workspace.Dblik as Program<Dblik>;
const programId = program.programId;

describe("dblik", () => {

  const buffer = Buffer.concat([
    Buffer.from("29052024"),
    Buffer.from("103"),
    program.programId.toBuffer()
  ]);

  const keys = web3.Keypair.fromSeed(sha256(buffer));

  it("Init transaction", async () => {

    const _ = await initializeTransactionAccount(provider.connection,
      program.programId,
      keys,
      user);

    await printTransaction(provider.connection, keys.publicKey);

    const requestPaymentTx = await program.methods.requestPayment(new BN(0.003 * web3.LAMPORTS_PER_SOL), "message-111111")
      .accounts({
        signer: user.publicKey,
        transaction: keys.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()
      .catch(e => console.error(e));

    console.log("requestPaymentTx: ", requestPaymentTx); 

    const transaction = await getTransaction(provider.connection, keys.publicKey);

    const confirmTransactionTx = await program.methods.confirmTransaction()
      .accounts({
        signer: user.publicKey,
        transaction: keys.publicKey,
        store: transaction.store
      })
      .rpc()
      .catch(e => console.error(e));

    console.log("confirmTransactionTx: ", confirmTransactionTx);
    await printTransaction(provider.connection, keys.publicKey);

    const cancelTransactionTx = await program.methods.cancelTransaction()
      .accounts({
        signer: user.publicKey,
        transaction: keys.publicKey,
        store: transaction.store,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()
      .catch(e => console.error(e));

    const setTimeoutTx = await program.methods.setTimeout()
      .accounts({
        signer: user.publicKey,
        transaction: keys.publicKey,
        store: transaction.store,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()
      .catch(e => console.error(e));

    const closeTransactionAccountTx = await program.methods.closeTransactionAccount()
      .accounts({
        signer: user.publicKey,
        transaction: keys.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()
      .catch(e => console.error(e));
  });

});

async function getTransaction(connection: anchor.web3.Connection, account: PublicKey) {
  const acc = await provider.connection.getAccountInfo(account);

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

async function printTransaction(connection: anchor.web3.Connection, account: PublicKey) {
  const data = await getTransaction(connection, account);
  console.log("amount:", data.amount);
  console.log("customer:", data.customer.toString());
  console.log("message:", data.message.toString());
  console.log("state:", data.state);
  console.log("store:", data.store.toString());
  console.log("timestamp:", data.timestamp);
}

async function initializeTransactionAccount(
  connection: anchor.web3.Connection,
  programId: PublicKey,
  accountKeypair: Keypair,
  payerWallet: Wallet): Promise<string | void> {
  const accSize = 93 + 10;
  let createAccountInstruction = anchor.web3.SystemProgram.createAccount({
    fromPubkey: payerWallet.publicKey,
    newAccountPubkey: accountKeypair.publicKey,
    lamports: await connection.getMinimumBalanceForRentExemption(
      accSize
    ),
    space: accSize,
    programId: programId
  });

  const initTransactionInstruction = await program.methods.initTransaction()
    .accounts({
      signer: user.publicKey,
      transaction: accountKeypair.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .instruction();

  let blockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

  const messageV0 = new TransactionMessage({
    payerKey: payerWallet.publicKey,
    recentBlockhash: blockhash,
    instructions: [createAccountInstruction, initTransactionInstruction],
  }).compileToV0Message();

  const tx = new VersionedTransaction(messageV0);
  [accountKeypair].forEach(s => tx.sign([s]));
  payerWallet.signTransaction(tx);

  const signature = await connection.sendTransaction(tx).catch(e => console.error(e));

  console.log("Account: https://explorer.solana.com/address/" + accountKeypair.publicKey + "?cluster=devnet\nTx: https://explorer.solana.com/tx/" + signature + "?cluster=devnet");

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
