"use client";
import { createContext, useContext } from "react";
import Logotype from "@/components/Logotype";

const AppContext = createContext<any>(undefined);

export function AppWrapper({children} : {
    children: React.ReactNode
}) {
    return (
    <>
    <Logotype/>
    {children}
    </>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}
