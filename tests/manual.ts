import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Experiments } from "../target/types/experiments";
import { Keypair, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { Buffer } from 'buffer';
import {sha256} from '@noble/hashes/sha256';
import { Wallet } from "@coral-xyz/anchor/dist/cjs/provider"


describe("manual", () => {

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet;
  const program = anchor.workspace.Experiments as Program<Experiments>;

  const transactionAccountKeypair = createKeypair(["17032024", "104"], program.programId);

  it("create transaction account", async () => {

    const tx = await createAccount(provider.connection, 
      program.programId,
      transactionAccountKeypair,
      wallet);

      console.log("tx: ", tx);
    
  });

  
  it("get account", async () => {

    const acc = await provider.connection.getAccountInfo(transactionAccountKeypair.publicKey);
    console.log(JSON.stringify(acc));
    
  });

  it("activate transaction account", async () => {

    const tx = await program.methods.activateManual()
    .accounts({
      signer: wallet.publicKey,
      account: transactionAccountKeypair.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    //.signers([transactionAccountKeypair])
    .rpc()
    .catch(e => console.error(e));
    
    console.log("tx: ", tx);
  });

  it("use transaction account", async () => {

    const tx = await program.methods.useManual()
    .accounts({
      signer: wallet.publicKey,
      account: transactionAccountKeypair.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    //.signers([transactionAccountKeypair])
    .rpc()
    .catch(e => console.error(e));
    
    console.log("tx: ", tx);
  });

});

async function createAccount(
  connection: anchor.web3.Connection, 
  programId: PublicKey, 
  accountKeypair: Keypair,
  payerWallet: Wallet) : Promise<string | void>
{
  let createAccountInstruction = anchor.web3.SystemProgram.createAccount({
    fromPubkey: payerWallet.publicKey,
    newAccountPubkey: accountKeypair.publicKey,
    lamports: await connection.getMinimumBalanceForRentExemption(
      200
    ),
    space: 200,
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

function createKeypair(seeds: string[], programId: PublicKey) : Keypair
{
  let buffer = Buffer.alloc(0);
  let seedsBuffer = seeds.map(Buffer.from);

  for(let nonce = 255; nonce >= 0; nonce--)
  {
    try 
    {
      const seedsWithNonce = seedsBuffer.concat(Buffer.from([nonce]));
      seedsWithNonce.forEach(function (seed) {
        if (seed.length > 32) {
          throw new TypeError(`Max seed length exceeded`);
        }
        buffer = Buffer.concat([buffer, seed]);
      });
    
      buffer = Buffer.concat([
        buffer,
        programId.toBuffer(),
        Buffer.from('ProgramDerivedAddress')
      ]);
  
      return Keypair.fromSeed(sha256(buffer));
    }
    catch(err)
    {
      if (err instanceof TypeError) 
      {
        throw err;
      }
    }

    throw new TypeError("");
  }
}
