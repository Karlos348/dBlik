"use client";
import { GenerateCodeButton } from "@/components/GenerateCodeButton";
import { useWallet } from "@solana/wallet-adapter-react";
import Timer from "@/components/Timer";
import { PaymentRequestBox } from "@/components/PaymentRequestBox";
import { Code } from "@/components/Code";

export default function Home() {
  const {connected} = useWallet();

  return (
    <main className="flex flex-col items-center mb-16">
      {connected ? <>
        <Code/>
        <GenerateCodeButton />
        <Timer/>
        <PaymentRequestBox />
      </>
      : <></>}
    </main>
  )
}
