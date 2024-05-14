"use client"
import { createContext, useContext } from "react";
import Logotype from "@/components/Logotype";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { ProductsList } from "@/components/ProductsList";

const AppContext = createContext<any>(undefined);

export function AppWrapper({children} : {
    children: React.ReactNode
}) {
    return (
    <>
    <Logotype/>
    <ProductsList>
    <TransactionProvider children>
        {children}
    </TransactionProvider>
    </ProductsList>
    </>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}
