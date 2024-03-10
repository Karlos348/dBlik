import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Experiments } from "../target/types/experiments";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

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

  it("Create large account", async () => {

    const [pda] = await anchor.web3.PublicKey.findProgramAddressSync(
      [anchor.AnchorProvider.env().wallet.publicKey.toBuffer()],
      anchor.web3.SystemProgram.programId
    );
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
    const tx3 = await program.methods.createLargeAccount()
      .accounts({
        signer: user.publicKey,
        programData: pda,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      //.signers([])
      .rpc()
      .catch(e => console.error(e));

      console.log("[Create large account] tx: ", tx3);
  });

  it("Large data program", async () => {
    const lamports = await anchor.AnchorProvider.env().connection.getMinimumBalanceForRentExemption(150000);
    console.log("SOL: ", lamports/LAMPORTS_PER_SOL);
    // if(lamports > LAMPORTS_PER_SOL * 40)
    // {
    //   return;
    // }

    const account2 = anchor.web3.Keypair.generate();
    const tx2 = await program.methods.large()
      .accounts({
        signer: user.publicKey,
        programData: account2.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([account2])
      .rpc();

      console.log("[Large data program] tx: ", tx2);
  });
});
