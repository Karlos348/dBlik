import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Dblik } from "../target/types/dblik";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

describe("dblik", () => {
  const provider = anchor.AnchorProvider.env();
  console.log("wallet public key: ", provider.wallet.publicKey);
  
  anchor.setProvider(provider);
  const user = provider.wallet;
  const program = anchor.workspace.Dblik as Program<Dblik>;
  const programId = program.programId;
  const newAcc = anchor.web3.Keypair.generate();

  const storageAcc = anchor.web3.Keypair.generate();

  it("initialize", async () => {

    const tx = await program.methods.initialize().accounts({
      programData: newAcc.publicKey,
      storage: storageAcc.publicKey
    })
    .signers([newAcc]).rpc().catch(e => console.error(e));;
    console.log("Your transaction signature", tx);

    //var tst = await program.account.programData.fetch(newAcc.publicKey);
    //console.log("transactions: ", tst.transactions);
    
    //assert.equal(123321, tst.code.toNumber());
  });

  it("just logs", async () => {
    const tx = await program.methods.justLogs()
    .accounts({
      programData: newAcc.publicKey,
      storage: storageAcc.publicKey
    }).rpc();
    console.log("Your transaction signature", tx);
  });


/*
  it("set data", async () => {
    const data = 555666;
    const tx = await program.methods.setData(new anchor.BN(data))
    .accounts({
      transaction: newAcc.publicKey
    }).rpc();
    console.log("Your transaction signature", tx);

    var tst = await program.account.transaction.fetch(newAcc.publicKey);
    console.log("code: ", tst.code.toNumber());
    console.log("customer: ", tst.customer);
    console.log("shop: ", tst.shop);
    assert.equal(data, tst.code.toNumber());
  });*/
});
