"use client"
import { createContext, useContext } from "react";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { TransactionProvider2 } from "@/contexts/TransactionContext2";

const AppContext = createContext<any>(undefined);

export function AppWrapper({children} : {
    children: React.ReactNode
}) {
    return (
        <TransactionProvider2>
            {children}
        </TransactionProvider2>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}
