import { get_program, get_provider } from "@/utils/anchor";
import { web3 } from "@coral-xyz/anchor";

export default async function handler(req, res) {

    const { transactionPubkey } = req.body;
    const provider = get_provider(process);
    const program = get_program(provider);

    const tx = await program.methods.setTimeout()
        .accounts({
      signer: provider.publicKey,
      transaction: transactionPubkey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
    
    res.status(200).json(tx);
  }