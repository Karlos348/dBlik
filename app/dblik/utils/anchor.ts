import { Dblik, IDL } from "@/idl/dblik";
import { Program } from "@coral-xyz/anchor";
import { Cluster, clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

export const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID as string);
export const INITIAL_ACCOUNT_SIZE: number = 103;

const connection = new Connection(clusterApiUrl(process.env.NEXT_PUBLIC_CLUSTER as Cluster), {
    commitment: "confirmed",
});
export const program = new Program<Dblik>(IDL, programId, {
    connection: connection,
});