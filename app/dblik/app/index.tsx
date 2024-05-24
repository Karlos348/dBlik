"use client";
import { BalanceProvider } from "@/contexts/BalanceContext";
import { createContext, useContext } from "react";
import WalletContextProvider from "@/contexts/WalletContextProvider";
import Logotype from "@/components/Logotype";
import { TransactionProvider } from "@/contexts/TransactionContext";
import WalletMultiButton from "@/components/WalletMultiButton";

const AppContext = createContext<any>(undefined);

export function AppWrapper({children} : {
    children: React.ReactNode
}) {
    return (
<WalletContextProvider>
    <BalanceProvider>
        <Logotype/>
        <WalletMultiButton/>
        <TransactionProvider>
            {children}
        </TransactionProvider>
    </BalanceProvider>
</WalletContextProvider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}
