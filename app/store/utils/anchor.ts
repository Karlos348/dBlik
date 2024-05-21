import { Dblik, IDL } from "@/idl/dblik";
import {
    AnchorProvider,
    Program
} from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Cluster, clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";

export function get_provider(process : NodeJS.Process) : AnchorProvider
{
    const connection = new Connection(clusterApiUrl(process.env.CLUSTER as Cluster));
    const wallet = new NodeWallet(Keypair.fromSecretKey(Uint8Array.from(process.env.STORE_KEYPAIR?.split(',').map(x => parseInt(x)) as number[])));
    return new AnchorProvider(connection, wallet, {
        commitment: "confirmed",
    });
}

export function get_program(provider: AnchorProvider) : Program<Dblik>
{
    return new Program<Dblik>(IDL, programId, provider);
}

export const programId = new PublicKey("EE4v8mDaBcnXjYakNPUExR1DGZXS4ba4vyBSrqXXRRF3");

export const INITIAL_ACCOUNT_SIZE: number = 103;