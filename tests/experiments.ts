import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Experiments } from "../target/types/experiments";
import { Account, Connection, Keypair, LAMPORTS_PER_SOL, NONCE_ACCOUNT_LENGTH, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
//import { sha256 } from "js-sha256";
import { Buffer } from 'buffer';
import {sha256} from '@noble/hashes/sha256';
import {ed25519} from '@noble/curves/ed25519';
import { hkdf } from '@noble/hashes/hkdf';
import { assert } from "chai";
import * as crypto from 'crypto';
import * as BufferLayout from '@solana/buffer-layout';


describe("experiments", () => {

  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();
  const wallet = anchor.AnchorProvider.env().wallet;
  const program = anchor.workspace.Experiments as Program<Experiments>;

  it("keypair creating v2 / ignore findProgramAddressSync implementation", async () => {

    let buffer = Buffer.alloc(0);
    let seeds = Array<Buffer>(Buffer.from("111111x"));

    //const seedsWithNonce = seeds.concat(Buffer.from([254])); // hardcoded

    let keypair: anchor.web3.Keypair;
    for(let nonce = 255; nonce >= 0; nonce--)
    {
      try 
      {
        const seedsWithNonce = seeds.concat(Buffer.from([nonce]));
        seedsWithNonce.forEach(function (seed) {
          if (seed.length > 32) {
            throw new TypeError(`Max seed length exceeded`);
          }
          buffer = Buffer.concat([buffer, toBuffer(seed)]);
        });
      
        buffer = Buffer.concat([
          buffer,
          program.programId.toBuffer(),
          Buffer.from('ProgramDerivedAddress')
        ]);
    
        keypair = Keypair.fromSeed(sha256(buffer));
        break;
      } 
      catch(err)
      {
        if (err instanceof TypeError) {
          throw err;
        }
      }
    }

    let createAccountInstruction = anchor.web3.SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: keypair.publicKey,
      lamports: await anchor.AnchorProvider.env().connection.getMinimumBalanceForRentExemption(
        82
      ),
      space: 82,
      programId: program.programId,
    });

    const createAccountTransaction = await buildTransaction(
      anchor.AnchorProvider.env().connection,
      wallet.publicKey,
      [keypair],
      [createAccountInstruction],
    );

    
    wallet.signTransaction(createAccountTransaction);
    const signature = await anchor.AnchorProvider.env().connection.sendTransaction(createAccountTransaction).catch(e => console.error(e));
    console.log("[Create large account]\naccount: https://explorer.solana.com/address/"+keypair.publicKey+"?cluster=devnet\ntx: https://explorer.solana.com/tx/"+signature+"?cluster=devnet");

  });

it("keypair creating", async () => {

  // caused by fact that built-in anchor.web3.SystemProgram.createAccountWithSeed makes the seed visible 
  const [sample, _] = await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("321123")],
    program.programId
  );

  let buffer = Buffer.alloc(0);
  let seeds = Array<Buffer>(Buffer.from("321123"));
  const seedsWithNonce = seeds.concat(Buffer.from([254])); // hardcoded

  seedsWithNonce.forEach(function (seed) {
    if (seed.length > 32) {
      throw new TypeError(`Max seed length exceeded`);
    }
    buffer = Buffer.concat([buffer, toBuffer(seed)]);
  });

  buffer = Buffer.concat([
    buffer,
    program.programId.toBuffer(),
    Buffer.from('ProgramDerivedAddress'),
  ]);

  const publicKeyBytes = sha256(buffer);
  let publicKey = new PublicKey(publicKeyBytes);

  assert.equal(publicKey.toString(), sample.toString());

  // todo secretKey

  //ed25519.getPublicKey(...);
  // const secretKey = new Uint8Array(64);
  //  secretKey.set(..);
  //  secretKey.set(publicKeyBytes, 32)

  // new Keypair({publicKey, secretKey});

});



  // it("Standard program", async () => {
  //   const account = anchor.web3.Keypair.generate();
  //   const tx = await program.methods.standard()
  //   .accounts({
  //     signer: user.publicKey,
  //     programData: account.publicKey,
  //     systemProgram: anchor.web3.SystemProgram.programId
  //   })
  //   .signers([account])
  //   .rpc()
  //   .catch(e => console.error(e));

  //   console.log("[Standard program] tx: ", tx);
  // });

  // it("Seed", async () => {

  //   const [pda, _] = await anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("seed")],
  //     program.programId
  //   );

  //   const tx = await program.methods.withSeed()
  //   .accounts({
  //     signer: wallet.publicKey,
  //     programData: pda,
  //     systemProgram: anchor.web3.SystemProgram.programId
  //   })
  //   .rpc()
  //   .catch(e => console.error(e));

  //   console.log("[Account with seeded acc attached] tx: ", tx);
  //   console.log("[Seeded acc] tx: ", pda.toString());
    
  // });

  // it("Create large account", async () => {

  //   let accountKeys = anchor.web3.Keypair.generate();

  //   let createAccountInstruction = anchor.web3.SystemProgram.createAccount({
  //     fromPubkey: user.publicKey,
  //     newAccountPubkey: accountKeys.publicKey,
  //     lamports: await anchor.AnchorProvider.env().connection.getMinimumBalanceForRentExemption(
  //       348
  //     ),
  //     space: 348,
  //     programId: anchor.web3.SystemProgram.programId,
  //   });

  //   const createAccountTransaction = await buildTransaction(
  //     anchor.AnchorProvider.env().connection,
  //     user.publicKey,
  //     [accountKeys],
  //     [createAccountInstruction],
  //   );
    

  //   user.signTransaction(createAccountTransaction);
  //   const signature = await anchor.AnchorProvider.env().connection.sendTransaction(createAccountTransaction);
  //   console.log("[Create large account]\naccount: https://explorer.solana.com/address/"+accountKeys.publicKey+"?cluster=devnet\ntx: https://explorer.solana.com/tx/"+signature+"?cluster=devnet");

  // it("Large data program", async () => {
  //   const lamports = await anchor.AnchorProvider.env().connection.getMinimumBalanceForRentExemption(150000);
  //   console.log("SOL: ", lamports/LAMPORTS_PER_SOL);
  //   if(lamports > LAMPORTS_PER_SOL * 40)
  //   {
  //     return;
  //   }

  //   const account2 = anchor.web3.Keypair.generate();
  //   const tx2 = await program.methods.large()
  //     .accounts({
  //       signer: user.publicKey,
  //       programData: account2.publicKey,
  //       systemProgram: anchor.web3.SystemProgram.programId
  //     })
  //     .signers([account2])
  //     .rpc();

  //     console.log("[Large data program] tx: ", tx2);
  // });
});


async function buildTransaction(
	connection: Connection,
	payer: PublicKey,
	signers: Keypair[],
	instructions: TransactionInstruction[],
): Promise<VersionedTransaction> {
	let blockhash = await connection
		.getLatestBlockhash()
		.then((res) => res.blockhash);

	const messageV0 = new TransactionMessage({
		payerKey: payer,
		recentBlockhash: blockhash,
		instructions,
	}).compileToV0Message();

	const tx = new VersionedTransaction(messageV0);

	signers.forEach((s) => tx.sign([s]));

	return tx;
}

const toBuffer = (arr: Buffer | Uint8Array | Array<number>): Buffer => {
  if (Buffer.isBuffer(arr)) {
    return arr;
  } else if (arr instanceof Uint8Array) {
    return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
  } else {
    return Buffer.from(arr);
  }
};
