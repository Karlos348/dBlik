import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Dblik } from "../target/types/dblik";
import { SystemProgram, PublicKey, Keypair } from "@solana/web3.js";
import { assert } from "chai";

describe("dblik", () => {

  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const user = provider.wallet;
  const program = anchor.workspace.Dblik as Program<Dblik>;
  const programId = program.programId;
  const newAcc = anchor.web3.Keypair.generate();

  it("initialize", async () => {
    const tx = await program.methods.initialize().accounts({
      acc: newAcc.publicKey
    })
    .signers([newAcc]).rpc();
    console.log("Your transaction signature", tx);
  });

  it("set data", async () => {
    const tx = await program.methods.setData(new anchor.BN(10))
    .accounts({
      myAccount: newAcc.publicKey
    }).rpc();
    console.log("Your transaction signature", tx);
  })
});
