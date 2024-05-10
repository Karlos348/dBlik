import { Dblik, IDL } from "@/idl/dblik";
import {
    AnchorProvider,
    Program,
    setProvider
} from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";

export const connection = new Connection(clusterApiUrl("devnet"), {
    commitment: "confirmed",
});

const wallet = new NodeWallet(Keypair.fromSecretKey(Uint8Array.from(process.env.STORE_KEYPAIR?.split(',').map(x => parseInt(x)) ?? []))); // todo fix
export const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
});
setProvider(provider);

export const programId = new PublicKey("EE4v8mDaBcnXjYakNPUExR1DGZXS4ba4vyBSrqXXRRF3");

export const INITIAL_ACCOUNT_SIZE: number = 103;

export const program = new Program<Dblik>(IDL, programId, provider);