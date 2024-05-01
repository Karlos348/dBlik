const TRANSACTION_WINDOW_IN_MINUTES: number = 10;
const TRANSACTION_EXPIRATION_TIME_IN_SECONDS: number = 120;
const MINUTES_TO_SECONDS_MULTIPLIER: number = 60;

export function roundDateForCustomer(date: Date) : string {
    return getUtcDateRoundedUp(date)
}

export function roundDateForStore(date: Date) : string[]
{
    if(isInOverlapZone(date))
    {
        return [
            getUtcDateRoundedDown(date), 
            getUtcDateRoundedUp(date)
        ];
    }

    return [getUtcDateRoundedUp(date)];
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