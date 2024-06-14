"use client"
import { TransactionProvider } from "@/contexts/TransactionContext";
import { createContext, useContext } from "react";

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
