import { Dblik, IDL } from "@/idl/dblik";
import {
    AnchorProvider,
    Program,
    setProvider,
} from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

export const connection = new Connection(clusterApiUrl("devnet"), {
    commitment: "confirmed",
});

export const StaticWallet = {
    publicKey: new PublicKey("5ctBcsuKYt19mBqPj6Sfbz6cfv6gRFu6Gm5G4hiK8Gv8"),
    signTransaction: () => Promise.reject(),
    signAllTransactions: () => Promise.reject(),
};

export const provider = new AnchorProvider(connection, StaticWallet, {});
setProvider(provider);

export const programId = new PublicKey("EE4v8mDaBcnXjYakNPUExR1DGZXS4ba4vyBSrqXXRRF3");

export const INITIAL_ACCOUNT_SIZE: number = 103;

export const program = new Program<Dblik>(IDL, programId, {
    connection: connection,
});