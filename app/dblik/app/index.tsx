"use client";
import { BalanceProvider } from "@/contexts/BalanceContext";
import { createContext, useContext } from "react";
import WalletWrapper from "@/contexts/WalletContextProvider";

const AppContext = createContext<any>(undefined);

export function AppWrapper({children} : {
    children: React.ReactNode
}) {
    return (
<WalletWrapper>
    <BalanceProvider>
        {children}
    </BalanceProvider>
</WalletWrapper>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}
