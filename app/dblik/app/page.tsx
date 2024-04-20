"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useBalance } from "@/contexts/BalanceContext";
import WalletMultiButton from "@/components/WalletMultiButton";

export default function Home() {
  const {balance} = useBalance();
  const {publicKey} = useWallet();
  const {connection} = useConnection();

  return (
<main className="flex min-h-screen flex-col items-center justify-between p-64">
  pk: {publicKey?.toString() ?? ""}<br/>
  balance: {balance}
  <WalletMultiButton/>
</main>
  )
}
