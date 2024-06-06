import { useTransaction } from '@/contexts/TransactionContext';
import { TransactionState } from '@/models/transaction';
import { TRANSACTION_EXPIRATION_TIME_IN_SECONDS } from '@/utils/anchor';

export default function Timer() {
    const { transaction, code, timeLeft } = useTransaction();
    const totalTime = TRANSACTION_EXPIRATION_TIME_IN_SECONDS;

    const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;

    return (
        <>
            {transaction?.state === TransactionState.Initialized && code !== undefined
                ? <div className="w-96 mt-3 z-auto">
                    <div className="relative h-6 rounded-md overflow-hidden mb-1 z-20 shadow-lg" style={{ backgroundColor: `rgba(0, 255, 200, 0.4)` }}>
                        <div
                            id="progress-bar"
                            className="absolute top-0 left-0 h-full z-30"
                            style={{ width: `${progressPercentage}%`, backgroundColor: `rgba(255, 105, 180, 0.7)` }}
                        ></div>
                        <p id="timer" className="z-40 absolute inset-0 flex items-center justify-center text-center text-m">{timeLeft}</p>
                    </div>
                </div>
                : <></>
            }
        </>
    );
};
