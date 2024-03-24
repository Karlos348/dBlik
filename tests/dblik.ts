import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Dblik } from "../target/types/dblik";
import * as web3 from "@solana/web3.js";
import {sha256} from '@noble/hashes/sha256';
import * as token from "@solana/spl-token";
import { assert } from "chai";

const provider = anchor.AnchorProvider.env();
console.log("wallet public key: ", provider.wallet.publicKey);
anchor.setProvider(provider);
const user = provider.wallet;
const program = anchor.workspace.Dblik as Program<Dblik>;
const programId = program.programId;

describe("dblik", () => {
  
  const buffer = Buffer.concat([
    Buffer.from("24032024"),
    Buffer.from("100"),
    program.programId.toBuffer()
  ]);

  const keys = web3.Keypair.fromSeed(sha256(buffer));

  it("Init transaction", async () => {
    
    const tx = await program.methods.initTransaction()
    .accounts({
      signer: user.publicKey,
      account: keys.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc()
    .catch(e => console.error(e));

    console.log("tx: ", tx);
  });

});