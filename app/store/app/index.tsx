"use client"
import { createContext, useContext } from "react";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { ProductsList } from "@/components/ProductsList";
import { CodeForm } from "@/components/CodeForm";

const AppContext = createContext<any>(undefined);

export function AppWrapper({children} : {
    children: React.ReactNode
}) {
    return (
    <>
    <TransactionProvider children>
    <ProductsList>
        {children}
    </ProductsList>
    <CodeForm/>
    </TransactionProvider>
    </>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}
