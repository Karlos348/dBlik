"use client"
import { CodeForm } from "@/components/CodeForm";
import { useTransaction } from "@/contexts/TransactionContext";

export default function Home() {

  const {code} = useTransaction();

  return (
<main className="flex min-h-screen flex-col items-center justify-between p-64">
  STORE<br/>
  {code === null ? <CodeForm/> : code}
</main>
  )
}
