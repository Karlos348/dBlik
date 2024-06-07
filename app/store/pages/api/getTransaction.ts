// import { getTransaction, mapToDto } from "@/clients/transaction_client";
// import { get_provider } from "@/utils/anchor";
// import { PublicKey } from "@solana/web3.js";

// export default async function handler(req, res) {

//     const { transactionPubkey } = req.body;
//     const provider = get_provider(process);

//     console.log(transactionPubkey)
//     const rawTransaction = await getTransaction(provider, new PublicKey(transactionPubkey));
//     console.log(rawTransaction)
//     if(rawTransaction === undefined) {
//         return res.status(404);
//     }

//     const dto = mapToDto(rawTransaction);
//     return res.status(200).json(dto);
//   }