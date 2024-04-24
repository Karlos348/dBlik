import { generateCode } from "./code";

const TRANSACTION_WINDOW_IN_MINUTES: number = 10;
const TRANSACTION_EXPIRATION_TIME_IN_SECONDS: number = 120;
const MINUTES_TO_SECONDS_MULTIPLIER: number = 60;

export function generateSeedForCustomer() {
    return generateCode().toString() + getRoundedUtcDate(new Date());
}

export function generateSeedsForStore(code: number)
{
    const now = new Date();
    if(isInOverlapZone(now))
    {
        // todo: check also previous rounded date
        return getRoundedUtcDate(now);
    }

    return code.toString()+getRoundedUtcDate(now);
}

function getRoundedUtcDate(date: Date) {
    const minutes = date.getUTCMinutes();
    date.setMinutes(minutes + TRANSACTION_WINDOW_IN_MINUTES - (minutes % TRANSACTION_WINDOW_IN_MINUTES));
    // todo: add minutes instead of set (?)
    
    return date.toISOString().replace(/\D/g, '').slice(0, 12);
}

function isInOverlapZone(date: Date) {
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return ((minutes % TRANSACTION_WINDOW_IN_MINUTES) * MINUTES_TO_SECONDS_MULTIPLIER) + seconds < TRANSACTION_EXPIRATION_TIME_IN_SECONDS;
}