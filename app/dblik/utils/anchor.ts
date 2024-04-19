import {
    AnchorProvider,
    setProvider,
} from "@coral-xyz/anchor"
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js"


export const connection = new Connection(clusterApiUrl("devnet"), {
    commitment: "confirmed",
})

export const StaticWallet = {
publicKey: new PublicKey("5ctBcsuKYt19mBqPj6Sfbz6cfv6gRFu6Gm5G4hiK8Gv8"),
signTransaction: () => Promise.reject(),
signAllTransactions: () => Promise.reject(),
}

export const provider = new AnchorProvider(connection, StaticWallet, {})
setProvider(provider)

const programId = new PublicKey("EE4v8mDaBcnXjYakNPUExR1DGZXS4ba4vyBSrqXXRRF3")