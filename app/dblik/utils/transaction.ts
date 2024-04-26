import { Keypair } from "@solana/web3.js";
import { programId } from "./anchor";
import { generateCode } from "./code";
import {sha256} from '@noble/hashes/sha256';

const TRANSACTION_WINDOW_IN_MINUTES: number = 10;
const TRANSACTION_EXPIRATION_TIME_IN_SECONDS: number = 120;
const MINUTES_TO_SECONDS_MULTIPLIER: number = 60;

export function getKeypair(seed: string) : Keypair
{
    const buffer = Buffer.concat([
        Buffer.from(seed),
        programId.toBuffer()
    ]);
      
    return Keypair.fromSeed(sha256(buffer));
}

export function generateSeedForCustomer(date: Date) : string {
    return generateCode().toString() + getUtcDateRoundedUp(new Date());
}

export function generateSeedsForStore(code: number, date: Date) : string[]
{
    if(isInOverlapZone(date))
    {
        return [code.toString()+getUtcDateRoundedDown(date),
            code.toString()+getUtcDateRoundedUp(date)];
    }

    return [code.toString()+getUtcDateRoundedUp(date)];
}

function getUtcDateRoundedUp(date: Date) : string {
    const minutes = date.getUTCMinutes();
    date.setMinutes(minutes + TRANSACTION_WINDOW_IN_MINUTES - (minutes % TRANSACTION_WINDOW_IN_MINUTES));
    return date.toISOString().replace(/\D/g, '').slice(0, 12);
}

function getUtcDateRoundedDown(date: Date) : string {
    const minutes = date.getUTCMinutes();
    date.setMinutes(minutes - (minutes % TRANSACTION_WINDOW_IN_MINUTES));
    return date.toISOString().replace(/\D/g, '').slice(0, 12);
}

function isInOverlapZone(date: Date) : boolean {
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return ((minutes % TRANSACTION_WINDOW_IN_MINUTES) * MINUTES_TO_SECONDS_MULTIPLIER) + seconds < TRANSACTION_EXPIRATION_TIME_IN_SECONDS;
}