"use client";
import { BalanceProvider } from "@/contexts/BalanceContext";
import { createContext, useContext } from "react";
import WalletContextProvider from "@/contexts/WalletContextProvider";

const AppContext = createContext<any>(undefined);

export function AppWrapper({children} : {
    children: React.ReactNode
}) {
    return (
<WalletContextProvider>
    <BalanceProvider>
        {children}
    </BalanceProvider>
</WalletContextProvider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}
