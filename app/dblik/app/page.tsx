"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useBalance } from "@/contexts/BalanceContext";
import WalletMultiButton from "@/components/WalletMultiButton";
import { generateSeedForCustomer, generateSeedsForStore } from "@/utils/transaction";
import { useTransaction } from "@/contexts/TransactionContext";

export default function Home() {
  const {balance} = useBalance();
  const {publicKey} = useWallet();
  const {connection} = useConnection();
  const {tx, isClient} = useTransaction();
  const now = new Date();

  return (
<main className="flex min-h-screen flex-col items-center justify-between p-64">
  pk: {publicKey?.toString() ?? ""}<br/>
  balance: {balance}<br/>
  tx: {tx == '' ? '-' : tx}<br/>
  seed: {isClient ? generateSeedForCustomer(now) : '-'}<br/>
  seeds: {isClient ? generateSeedsForStore(123321, new Date(now)).toString() : '-'}<br/>
  <WalletMultiButton/>
</main>
  )
}
