"use client";

import { Connection, PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import WalletMultiButton from "../components/WalletMultiButton";
import { web3 } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { useAppContext } from ".";
import { useEffect } from "react";
import { BalanceProvider, useBalance } from "@/contexts/BalanceContext";

export default function Home() {
//const { publicKey  } = useWallet();
// const {connection } = useConnection();
// const conn = new Connection("https://api.devnet.solana.com");
const {balance} = useBalance();

return (
  <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <BalanceProvider>
      balance: {balance}
      </BalanceProvider>
  </main>
  )
}
