import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Wallet } from "@coral-xyz/anchor/dist/cjs/provider"
import { Dblik } from "../target/types/dblik";
import * as web3 from "@solana/web3.js";
import {sha256} from '@noble/hashes/sha256';
import * as token from "@solana/spl-token";
import { assert } from "chai";
import { Keypair, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";

const provider = anchor.AnchorProvider.env();
console.log("wallet public key: ", provider.wallet.publicKey);
anchor.setProvider(provider);
const user = provider.wallet;
const program = anchor.workspace.Dblik as Program<Dblik>;
const programId = program.programId;

describe("dblik", () => {
  
  const buffer = Buffer.concat([
    Buffer.from("26032024"),
    Buffer.from("100"),
    program.programId.toBuffer()
  ]);

  const keys = web3.Keypair.fromSeed(sha256(buffer));

  it("Init transaction", async () => {
    
    const createAccountRsp = await createAccount(provider.connection, 
      program.programId,
      keys,
      user);

    console.log(JSON.stringify(await provider.connection.getAccountInfo(keys.publicKey)));

    const tx = await program.methods.initTransaction()
    .accounts({
      signer: user.publicKey,
      account: keys.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc()
    .catch(e => console.error(e));

    console.log("tx: ", tx);

    console.log(JSON.stringify(await provider.connection.getAccountInfo(keys.publicKey)));
  });

});

async function createAccount(
  connection: anchor.web3.Connection, 
  programId: PublicKey, 
  accountKeypair: Keypair,
  payerWallet: Wallet) : Promise<string | void>
{
  const accSize = 120;
  let createAccountInstruction = anchor.web3.SystemProgram.createAccount({
    fromPubkey: payerWallet.publicKey,
    newAccountPubkey: accountKeypair.publicKey,
    lamports: await connection.getMinimumBalanceForRentExemption(
      accSize
    ),
    space: accSize,
    programId: programId,
  });

  let blockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

	const messageV0 = new TransactionMessage({
		payerKey: payerWallet.publicKey,
		recentBlockhash: blockhash,
    instructions: [createAccountInstruction]
	}).compileToV0Message();

	const tx = new VersionedTransaction(messageV0);
	[accountKeypair].forEach(s => tx.sign([s]));
  payerWallet.signTransaction(tx);

  const signature = await connection.sendTransaction(tx).catch(e => console.error(e));

  console.log("account: https://explorer.solana.com/address/"+accountKeypair.publicKey+"?cluster=devnet\ntx: https://explorer.solana.com/tx/"+signature+"?cluster=devnet");

  return signature;
}