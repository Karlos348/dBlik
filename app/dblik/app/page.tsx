'use client';

import { Connection } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import WalletMultiButton from "../components/WalletMultiButton";
import { web3 } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";

export default function Home() {

const { publicKey  } = useWallet();
// const {connection } = useConnection();
// const conn = new Connection("https://api.devnet.solana.com");

// const balance = conn.getBalance(new anchor.web3.PublicKey(
//   publicKey?.toString() ?? ""
// ), 'confirmed');
const a = "aa";
return (
  <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <WalletMultiButton />
    </main>
    
)
}
