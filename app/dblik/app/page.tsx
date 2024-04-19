"use client";

import { Connection, PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import WalletMultiButton from "../components/WalletMultiButton";
import { web3 } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { useAppContext } from ".";
import { useEffect } from "react";
import { useBalance } from "@/contexts/BalanceContext";

export default async function Home() {
const { publicKey  } = useWallet();
// const {connection } = useConnection();
// const conn = new Connection("https://api.devnet.solana.com");
const {balance, fetchBalance} = useBalance();

await fetchBalance();

return (
  <main className="flex min-h-screen flex-col items-center justify-between p-24">
   pk: {publicKey?.toString()}
   balance: {balance}
    <WalletMultiButton />
  </main>
  )
}
