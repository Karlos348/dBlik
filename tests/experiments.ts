import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Experiments } from "../target/types/experiments";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";

describe("experiments", () => {


  anchor.setProvider(anchor.AnchorProvider.env());
  const user = anchor.AnchorProvider.env().wallet;
  const program = anchor.workspace.Experiments as Program<Experiments>;

  it("Standard program", async () => {
    const account = anchor.web3.Keypair.generate();
    const tx = await program.methods.standard()
    .accounts({
      signer: user.publicKey,
      programData: account.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([account])
    .rpc()
    .catch(e => console.error(e));

    console.log("[Standard program] tx: ", tx);
  });

  it("Seed", async () => {

    let accountKeys = anchor.web3.Keypair.generate();
    const tx = await program.methods.withSeed()
    .accounts({
      signer: user.publicKey,
      programData: accountKeys.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([accountKeys])
    .rpc()
    .catch(e => console.error(e));

    console.log("[Created seeded acc] tx: ", tx);

    let utf8Encode = new TextEncoder();
  
    const [pda] = await anchor.web3.PublicKey.findProgramAddressSync(
      [utf8Encode.encode("simple_seed")],
      anchor.web3.SystemProgram.programId
    );
    console.log("[Seeded acc] tx: ", pda);
    
  });

  it("Create large account", async () => {

    let accountKeys = anchor.web3.Keypair.generate();

    let createAccountInstruction = anchor.web3.SystemProgram.createAccount({
      fromPubkey: user.publicKey,
      newAccountPubkey: accountKeys.publicKey,
      lamports: await anchor.AnchorProvider.env().connection.getMinimumBalanceForRentExemption(
        348
      ),
      space: 348,
      programId: anchor.web3.SystemProgram.programId,
    });

    const createAccountTransaction = await buildTransaction(
      anchor.AnchorProvider.env().connection,
      user.publicKey,
      [accountKeys],
      [createAccountInstruction],
    );
    

    user.signTransaction(createAccountTransaction);
    const signature = await anchor.AnchorProvider.env().connection.sendTransaction(createAccountTransaction);
    console.log("[Create large account]\naccount: https://explorer.solana.com/address/"+accountKeys.publicKey+"?cluster=devnet\ntx: https://explorer.solana.com/tx/"+signature+"?cluster=devnet");


    // const [pda] = await anchor.web3.PublicKey.findProgramAddressSync(
    //   [anchor.AnchorProvider.env().wallet.publicKey.toBuffer()],
    //   anchor.web3.SystemProgram.programId
    // );
    // const account3 = anchor.web3.Keypair.generate();

    // let acc = anchor.web3.SystemProgram.createAccount({
    //   fromPubkey: user.publicKey,
    //   newAccountPubkey: pda,
    //   lamports: await anchor.AnchorProvider.env().connection.getMinimumBalanceForRentExemption(
    //     150000
    //   ),
    //   space: 150000,
    //   programId: anchor.web3.SystemProgram.programId,
    // });

    // let tx = new anchor.web3.Transaction();
    // tx.add(acc);

    //console.log(account3.publicKey);
    /*const tx3 = await program.methods.createLargeAccount()
      .accounts({
        signer: user.publicKey,
        programData: pda,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      //.signers([])
      .rpc()
      .catch(e => console.error(e));

      console.log("[Create large account] tx: ", tx3);*/
  });

  it("Large data program", async () => {
    // const lamports = await anchor.AnchorProvider.env().connection.getMinimumBalanceForRentExemption(150000);
    // console.log("SOL: ", lamports/LAMPORTS_PER_SOL);
    // if(lamports > LAMPORTS_PER_SOL * 40)
    // {
    //   return;
    // }

    // const account2 = anchor.web3.Keypair.generate();
    // const tx2 = await program.methods.large()
    //   .accounts({
    //     signer: user.publicKey,
    //     programData: account2.publicKey,
    //     systemProgram: anchor.web3.SystemProgram.programId
    //   })
    //   .signers([account2])
    //   .rpc();

    //   console.log("[Large data program] tx: ", tx2);
  });
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