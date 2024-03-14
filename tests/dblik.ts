import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Dblik } from "../target/types/dblik";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { assert } from "chai";

const provider = anchor.AnchorProvider.env();
console.log("wallet public key: ", provider.wallet.publicKey);
anchor.setProvider(provider);
const user = provider.wallet;
const program = anchor.workspace.Dblik as Program<Dblik>;
const programId = program.programId;

describe("dblik", () => {
  

  it("Initialize customer account", async () => {
    
    const [pda, _] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("customer"), user.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods.initCustomer()
    .accounts({
      signer: user.publicKey,
      customer: pda,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .rpc()
    .catch(e => console.error(e));

    console.log("tx: ", tx);
  });

  it("Get accounts owned by program", async () => {
    
    let i = await anchor.AnchorProvider.env().connection.getProgramAccounts(program.programId);

    i.forEach(x => console.log(x.pubkey.toString()));
  });

});


// describe("dblik", () => {
  
//   const zkaccount = anchor.web3.Keypair.generate();

//   it("Create the account", async () => {
//     // Generate a new keypair for the new account
//     const account = anchor.web3.Keypair.generate();
//     const newAccount = anchor.web3.Keypair.generate();
//     const tx = await program.methods
//       .initialize()
//       .accounts({
//         signer: user.publicKey,
//         programData: account.publicKey,
//         storageAccount: newAccount.publicKey
//       })
//       .signers([account, newAccount])
//       .rpc()
//       .catch(e => console.error(e));

//     // Minimum balance for rent exemption for new account
//     const lamports = await provider.connection.getMinimumBalanceForRentExemption(1000);
//     console.log("lamports: ", lamports);
//     console.log("tx signature: ", tx);

//     // Check that the account was created
//     const accountInfo = await provider.connection.getAccountInfo(newAccount.publicKey);

//     assert(accountInfo.owner = web3.SystemProgram.programId);
//     //assert(accountInfo.lamports === lamports);
//   })

//   it("zk acc", async () => {
  
    
//     console.log("zkaccount: ", zkaccount.publicKey);
//     const tx = await program.methods
//       .runZk()
//       .accounts({
//         signer: user.publicKey,
//         programData: zkaccount.publicKey
//       })
//       .signers([zkaccount])
//       .rpc()
//       .catch(e => console.error(e));

//       console.log("tx signature: ", tx);

//     const accountInfo = await provider.connection.getAccountInfo(account.publicKey);

//     //assert(accountInfo.owner = web3.SystemProgram.programId);
//     //assert(accountInfo.lamports === lamports);
//   })

//   it("zk acc update", async () => {
  
//     const account = anchor.web3.Keypair.generate();
//     console.log("account: ", account.publicKey);
//     const tx = await program.methods
//       .runZk()
//       .accounts({
//         signer: user.publicKey,
//         programData: account.publicKey
//       })
//       .signers([user])
//       .rpc()
//       .catch(e => console.error(e));

//       console.log("tx signature: ", tx);

//     const accountInfo = await provider.connection.getAccountInfo(account.publicKey);

//     //assert(accountInfo.owner = web3.SystemProgram.programId);
//     //assert(accountInfo.lamports === lamports);
//   })


//   // it("initialize", async () => {

//   //   const tx = await program.methods.initialize().accounts({
//   //     programData: newAcc.publicKey,
//   //     storage: storageAcc.publicKey
//   //     })
//   //   .signers([newAcc])
//   //   .rpc().catch(e => console.error(e));;
//   //   console.log("Your transaction signature", tx);

//   //   //var tst = await program.account.programData.fetch(newAcc.publicKey);
//   //   //console.log("transactions: ", tst.transactions);
    
//   //   //assert.equal(123321, tst.code.toNumber());
//   // });

//   // it("just logs", async () => {
//   //   const tx = await program.methods.justLogs()
//   //   .accounts({
//   //     programData: newAcc.publicKey,
//   //     storage: storageAcc.publicKey
//   //   }).rpc();
//   //   console.log("Your transaction signature", tx);
//   // });


// /*
//   it("set data", async () => {
//     const data = 555666;
//     const tx = await program.methods.setData(new anchor.BN(data))
//     .accounts({
//       transaction: newAcc.publicKey
//     }).rpc();
//     console.log("Your transaction signature", tx);

//     var tst = await program.account.transaction.fetch(newAcc.publicKey);
//     console.log("code: ", tst.code.toNumber());
//     console.log("customer: ", tst.customer);
//     console.log("shop: ", tst.shop);
//     assert.equal(data, tst.code.toNumber());
//   });*/
// });
