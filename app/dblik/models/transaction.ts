import { PublicKey } from "@solana/web3.js";

export default class Transaction {
    customer: PublicKey | undefined;
    timestamp: number | undefined;
    state: TransactionState | undefined;
    store: PublicKey | undefined;
    amount: number | undefined;
    message: string | undefined;
}

export enum TransactionState {
    Initialized,
    Pending,
    Succeed,
    Expired,
    Canceled
}