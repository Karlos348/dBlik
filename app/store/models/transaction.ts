import { PublicKey } from "@solana/web3.js";

export default class Transaction {
    private _customer: PublicKey;
    public get customer(): PublicKey {
        return this._customer;
    }

    private _state: TransactionState;
    public get state(): TransactionState {
        return this._state;
    }

    private _timestamp?: number;
    public get timestamp(): number | undefined {
        return this._timestamp;
    }
    
    private _store?: PublicKey;
    public get store(): PublicKey | undefined {
        return this._store;
    }
    
    private _amount?: number | undefined;
    public get amount(): number | undefined {
        return this._amount;
    }
    
    private _message?: string | undefined;
    public get message(): string | undefined {
        return this._message;
    }

    constructor(customer: PublicKey, state: TransactionState, timestamp?: number,
        store?: PublicKey, amount?: number, message?: string) {
        this._customer = customer;
        this._timestamp = timestamp;
        this._state = state;
        this._store = store;
        this._amount = amount;
        this._message = message;
    }

    public update(customer: PublicKey, state: TransactionState, timestamp?: number,
        store?: PublicKey, amount?: number, message?: string) {
        this._customer = customer;
        this._timestamp = timestamp;
        this._state = state;
        this._store = store;
        this._amount = amount;
        this._message = message;
    }
}

export enum TransactionState {
    Initialized,
    Pending,
    Succeed,
    Timeout,
    Canceled
}