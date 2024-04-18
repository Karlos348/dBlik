"use client";
import WalletContextProvider from "@/contexts/WalletContextProvider";
import { PublicKey } from "@solana/web3.js";
import { createContext, useContext, useState } from "react";

const AppContext = createContext<any>(undefined);

export function AppWrapper({children} : {
    children: React.ReactNode
}) {

    return (
    <AppContext.Provider value={{state, setState}}>
        <WalletContextProvider>
            {children}
        </WalletContextProvider>
    </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}
