"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useBalance } from "@/contexts/BalanceContext";
import { useTransaction } from "@/contexts/TransactionContext";
import { ConfirmButton } from "@/components/ConfirmButton";
import { GenerateCodeButton } from "@/components/GenerateCodeButton";
import { TransactionState } from "@/models/transaction";

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
  state: {transaction.state === null ? 'not initialized' : TransactionState[transaction.state]}<br/>
  <GenerateCodeButton/>
  <ConfirmButton/>
  
</main>
  )
}
