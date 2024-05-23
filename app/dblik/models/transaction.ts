import { PublicKey } from "@solana/web3.js";
import { TransactionState } from "./transactionState";

export default class Transaction {
    customer: PublicKey;
    timestamp: number;
    state: TransactionState;
    store: PublicKey | undefined;
    amount: number | undefined;
    message: string | undefined;

    constructor(customer: PublicKey, 
        timestamp: number
    ) {
        this.customer = customer;
        this.timestamp = timestamp;
        this.state = TransactionState.New;
    }
}