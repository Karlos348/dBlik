import { generateCode } from "./code";

const TRANSACTION_WINDOW_IN_MINUTES: number = 10;

export function generateSeedForCustomer() {
    return generateCode().toString() + getRoundedUtcDate();
}

function getRoundedUtcDate() {
    const now = new Date();
    const minutes = now.getUTCMinutes();
    now.setMinutes(minutes + TRANSACTION_WINDOW_IN_MINUTES - (minutes % TRANSACTION_WINDOW_IN_MINUTES));
    return now.toISOString().replace(/\D/g, '').slice(0, 12);
}