import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Wallet } from "@coral-xyz/anchor/dist/cjs/provider"
import { Dblik, IDL } from "../target/types/dblik";
import * as web3 from "@solana/web3.js";
import { sha256 } from '@noble/hashes/sha256';
import { Keypair, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { BN } from "bn.js";
import { publicKey, u64 } from '@solana/buffer-layout-utils';
import { u32, u8, struct, seq } from '@solana/buffer-layout';
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { readFileSync } from "fs";
import path from "path";
import { assert } from "chai";

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const wallet = provider.wallet;
const program = anchor.workspace.Dblik as Program<Dblik>;
const programId = program.programId;

describe("happy path", function () {
  const keys = create_transaction_keypair(wallet);

  const store_keypair = load_store_keypair();
  const store_provider = get_store_provider(process, store_keypair);
  const store_program = new Program<Dblik>(IDL, programId, store_provider);

  it("Init transaction account", async function () {
    this.retries(3);
    const signature = await initializeTransactionAccount(provider.connection,
      program.programId,
      keys,
      wallet);

    console.log("signature: " + signature);
    assert.isString(signature);

    const transaction = await getTransaction(keys.publicKey);
    assert.equal(transaction.state, 0);
  });

  it("Request payment", async function () {
    this.retries(3);
    const signature = await store_program.methods.requestPayment(new BN(0.0001 * web3.LAMPORTS_PER_SOL), "message-111111")
      .accounts({
        signer: store_provider.publicKey,
        transaction: keys.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc({commitment: 'confirmed'})
      .catch(e => console.error(e));

      console.log("signature: " + signature);
      assert.isString(signature);

      const transaction = await getTransaction(keys.publicKey);
      assert.equal(transaction.state, 1);
  });

  it("Confirm transaction", async function () {
    this.retries(3);
      const signature = await program.methods.confirmTransaction()
      .accounts({
        signer: wallet.publicKey,
        transaction: keys.publicKey,
        store: store_keypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc({commitment: 'confirmed'})
      .catch(e => console.error(e));

      console.log("signature: " + signature);
      assert.isString(signature);

      const transaction = await getTransaction(keys.publicKey);
      assert.equal(transaction.state, 2);
  });

  it("Close account", async function () {
    this.retries(3);
    const signature = await program.methods.closeTransactionAccount()
    .accounts({
      signer: wallet.publicKey,
      transaction: keys.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .rpc({commitment: 'confirmed'})
    .catch(e => console.error(e));

    console.log("signature: " + signature);
    assert.isString(signature);
  });

});

describe("insufficient balance", () => {

  const keys = create_transaction_keypair(wallet);

  const store_keypair = load_store_keypair();
  const store_provider = get_store_provider(process, store_keypair);
  const store_program = new Program<Dblik>(IDL, programId, store_provider);

  it("Init transaction account", async function () {
    this.retries(3);
    const signature = await initializeTransactionAccount(provider.connection,
      program.programId,
      keys,
      wallet);

    console.log("signature: " + signature);
    assert.isString(signature);

    const transaction = await getTransaction(keys.publicKey);
    assert.equal(transaction.state, 0);
  });

  it("Request payment", async function () {
    this.retries(3);
    const signature = await store_program.methods.requestPayment(new BN(9999 * web3.LAMPORTS_PER_SOL), "message")
      .accounts({
        signer: store_provider.publicKey,
        transaction: keys.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc({commitment: 'confirmed'})
      .catch(e => console.error(e));

      console.log("signature: " + signature);
      assert.isString(signature);

      const transaction = await getTransaction(keys.publicKey);
      assert.equal(transaction.state, 1);
  });

  it("Confirm transaction", async function () {
    this.retries(3);
      const signature = await program.methods.confirmTransaction()
      .accounts({
        signer: wallet.publicKey,
        transaction: keys.publicKey,
        store: store_keypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc({commitment: 'confirmed'})
      .catch(e => e as anchor.AnchorError);

      assert.equal("InsufficientBalance", (signature as anchor.AnchorError).error?.errorCode.code);
  });

});

describe("transaction cancelation by customer", () => {
  const keys = create_transaction_keypair(wallet);

  const store_keypair = load_store_keypair();
  const store_provider = get_store_provider(process, store_keypair);
  const store_program = new Program<Dblik>(IDL, programId, store_provider);

  it("Init transaction account", async function () {
    this.retries(3);
    const signature = await initializeTransactionAccount(provider.connection,
      program.programId,
      keys,
      wallet);

    console.log("signature: " + signature);
    assert.isString(signature);

    const transaction = await getTransaction(keys.publicKey);
    assert.equal(transaction.state, 0);
  });

  it("Request payment", async function () {
    this.retries(3);
    const signature = await store_program.methods.requestPayment(new BN(0.0001 * web3.LAMPORTS_PER_SOL), "message")
      .accounts({
        signer: store_provider.publicKey,
        transaction: keys.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc({commitment: 'confirmed'})
      .catch(e => console.error(e));

      console.log("signature: " + signature);
      assert.isString(signature);

      const transaction = await getTransaction(keys.publicKey);
      assert.equal(transaction.state, 1);
  });

  it("Cancel transaction", async function () {
    this.retries(3);
    const signature = await program.methods.cancelTransaction()
      .accounts({
        signer: wallet.publicKey,
        transaction: keys.publicKey,
        store: store_keypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc({commitment: 'confirmed'})
      .catch(e => console.error(e));

      console.log("signature: " + signature);
      assert.isString(signature);

      const transaction = await getTransaction(keys.publicKey);
      assert.equal(transaction.state, 4);
  });

  it("Close account", async function () {
    this.retries(3);
    const signature = await program.methods.closeTransactionAccount()
    .accounts({
      signer: wallet.publicKey,
      transaction: keys.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .rpc({commitment: 'confirmed'})
    .catch(e => console.error(e));

    console.log("signature: " + signature);
    assert.isString(signature);
  });
});

describe("transaction expiration by store", () => {
  const keys = create_transaction_keypair(wallet);

  const store_keypair = load_store_keypair();
  const store_provider = get_store_provider(process, store_keypair);
  const store_program = new Program<Dblik>(IDL, programId, store_provider);

  it("Init transaction account", async function () {
    this.retries(3);
    const signature = await initializeTransactionAccount(provider.connection,
      program.programId,
      keys,
      wallet);

    console.log("signature: " + signature);
    assert.isString(signature);

    const transaction = await getTransaction(keys.publicKey);
    assert.equal(transaction.state, 0);
  });

  it("Request payment", async function () {
    this.retries(3);
    const signature = await store_program.methods.requestPayment(new BN(0.0001 * web3.LAMPORTS_PER_SOL), "message")
      .accounts({
        signer: store_provider.publicKey,
        transaction: keys.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc({commitment: 'confirmed'})
      .catch(e => console.error(e));

      console.log("signature: " + signature);
      assert.isString(signature);

      const transaction = await getTransaction(keys.publicKey);
      assert.equal(transaction.state, 1);
  });

  it("Set timeout", async function () {
    this.retries(3);
    const signature = await store_program.methods.setTimeout()
      .accounts({
        signer: store_provider.publicKey,
        store: store_provider.publicKey,
        transaction: keys.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc({commitment: 'confirmed'})
      .catch(e => e as anchor.AnchorError);

      assert.equal("TimeoutRequestedTooEarly", (signature as anchor.AnchorError).error.errorCode.code);

      const transaction = await getTransaction(keys.publicKey);
      assert.equal(transaction.state, 1);
  });
});

function get_store_provider(process : NodeJS.Process, store_keypair: Keypair) : AnchorProvider
{
    const connection = new web3.Connection(web3.clusterApiUrl(process.env.CLUSTER as web3.Cluster));
    const wallet = new NodeWallet(store_keypair);
    return new AnchorProvider(connection, wallet, {
        commitment: "confirmed",
    });
}

function load_store_keypair(): Keypair {
  const secretKeyString = readFileSync(path.resolve(__dirname, './store_keypair.json'), { encoding: 'utf8' });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
}

function create_transaction_keypair(wallet: Wallet): Keypair {
  const buffer = Buffer.concat([
    Buffer.from(Date.now().valueOf().toString()),
    Buffer.from(wallet.publicKey.toString()),
    program.programId.toBuffer()
  ]);
  const keys = web3.Keypair.fromSeed(sha256(buffer));
  return keys;
}

async function getTransaction(account: PublicKey) {
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

async function printTransaction(account: PublicKey) {
  const data = await getTransaction(account);
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
      signer: wallet.publicKey,
      transaction: accountKeypair.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .instruction();

  let latestBlockHash = await connection.getLatestBlockhash();

  const messageV0 = new TransactionMessage({
    payerKey: payerWallet.publicKey,
    recentBlockhash: latestBlockHash.blockhash,
    instructions: [createAccountInstruction, initTransactionInstruction],
  }).compileToV0Message();

  const tx = new VersionedTransaction(messageV0);
  [accountKeypair].forEach(s => tx.sign([s]));
  payerWallet.signTransaction(tx);

  const signature = await connection.sendTransaction(tx);

  const _ = await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: signature,
  }, 'confirmed');
  
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
