import { Keypair } from "@solana/web3.js";
import { programId } from "./anchor";
import {sha256} from '@noble/hashes/sha256';

export function getKeypair(seed: string) : Keypair
{
    const buffer = Buffer.concat([
        Buffer.from(seed),
        programId.toBuffer()
    ]);
      
    return Keypair.fromSeed(sha256(buffer));
}

export function generateSeedForCustomer(code: number, roundedDate: string) : string 
{
    return code.toString() + roundedDate;
}

export function generateSeedsForStore(code: number, roundedDate: string[]) : string[]
{
    return roundedDate.map(x => code.toString() + x)
}