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

  const buffer = Buffer.concat([
    Buffer.from("19032024"),
    Buffer.from("100"),
    program.programId.toBuffer()
  ]);

  const transactionAccountKeypair = Keypair.fromSeed(sha256(buffer));

  it("transfer", async () => {

    const tx = await program.methods.transfer()
    .accounts({
      signer: wallet.publicKey,
      store: new anchor.web3.PublicKey(
        "ETG6ga5VJj8TZkpUYRHSdp4rUPKQQ1EtiENPTaxfYmsx"
      ),
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc()
    .catch(e => console.error(e));
    
    console.log("tx: ", tx);
    
  });

  it("sub", async () => {

    (async () => {
      const publicKey = new anchor.web3.PublicKey(
        "7Vo3RPXvCm7BNgUeHHdYmvMSUUvaWWpyQ6MjiJrpfgFy"
      );
      provider.connection.onProgramAccountChange(
        publicKey,
        (updatedProgramInfo, context) =>
          console.log("Updated program info: ", updatedProgramInfo),
        "confirmed"
      );
    })();
    
  });

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
    .rpc()
    .catch(e => console.error(e));
    
    console.log("tx: ", tx);
  });

  it("realloc transaction account", async () => {

    const tx = await program.methods.reallocManual("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel elementum orci, vel fermentum tellus.")
    .accounts({
      signer: wallet.publicKey,
      account: transactionAccountKeypair.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
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
  const accSize = 8+32+1+32+5;
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
