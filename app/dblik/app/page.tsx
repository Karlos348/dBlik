"use client";
import { useTransaction } from "@/contexts/TransactionContext";
import { ConfirmButton } from "@/components/ConfirmButton";
import { GenerateCodeButton } from "@/components/GenerateCodeButton";
import { TransactionState } from "@/models/transaction";
import { useWallet } from "@solana/wallet-adapter-react";
import { IncomingTransactionBox } from "@/components/IncomingTransactionBox";

export default function Home() {
  const transaction = useTransaction();
  const {connected} = useWallet();

  return (
    <main className="flex min-h-screen flex-col items-center">
      {connected ? <>
        {transaction.code !== undefined 
          ? <div className="flex items-center justify-center w-96 h-16 text-4xl px-4 py-2 border border-gray-400 text-gray-700 rounded-md hover:shadow-md focus:outline-none focus:ring focus:ring-gray-200 mt-12 gray-border">
              <span className='uppercase tracking-widest'>{transaction.code}</span>
            </div> 
          : <></>}
        <GenerateCodeButton />
        <IncomingTransactionBox />
      </>
      : <></>}
    </main>
  )
}
