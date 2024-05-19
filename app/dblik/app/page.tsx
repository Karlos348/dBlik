"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useBalance } from "@/contexts/BalanceContext";
import WalletMultiButton from "@/components/WalletMultiButton";
import { useTransaction } from "@/contexts/TransactionContext";

export default function Home() {
  const {balance} = useBalance();
  const {publicKey} = useWallet();
  const transaction = useTransaction();

  return (
<main className="flex min-h-screen flex-col items-center justify-between p-64">
  pk: {publicKey?.toString() ?? ""}<br/>
  balance: {balance}<br/>
  tx: {transaction.tx}<br/>
  code: {transaction.isClient ? transaction.code : 'not generated'}<br/>
  state: {transaction.state.toString()}<br/>
  <WalletMultiButton/>
</main>
  )
}
