"use client"
import { createContext, useContext } from "react";
import Logotype from "@/components/Logotype";
import { TransactionProvider } from "@/contexts/TransactionContext";

const AppContext = createContext<any>(undefined);

export function AppWrapper({children} : {
    children: React.ReactNode
}) {
    return (
    <>
    <Logotype/>
    <TransactionProvider children>
        {children}
    </TransactionProvider>
    </>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}
