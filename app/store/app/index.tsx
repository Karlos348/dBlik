"use client"
import { createContext, useContext } from "react";
import { TransactionProvider } from "@/contexts/TransactionContext";

const AppContext = createContext<any>(undefined);

export function AppWrapper({children} : {
    children: React.ReactNode
}) {
    return (
        <TransactionProvider>
            {children}
        </TransactionProvider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}
