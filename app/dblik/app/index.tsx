"use client";
import { BalanceProvider, useBalance } from "@/contexts/BalanceContext";
import { createContext, useContext, useEffect, useState } from "react";
import WalletContextProvider from "@/contexts/WalletContextProvider";
import Logotype from "@/components/Logotype";
import { TransactionProvider } from "@/contexts/TransactionContext";
import WalletHeader from "@/components/WalletHeader";
import Wallets from "@/components/Wallets";

const AppContext = createContext<any>(undefined);

export function AppWrapper({children} : {
    children: React.ReactNode
}) {
    return (
<WalletContextProvider>
    <BalanceProvider>
    <WalletHeader/>
        <Logotype/>
        <Wallets/>
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
