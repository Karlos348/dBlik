import { useTransaction } from '@/contexts/TransactionContext';
import { TransactionState } from '@/models/transaction';

export function Code() {

    const transaction = useTransaction();

    if(transaction.code !== undefined && transaction.transaction?.state !== TransactionState.Succeed) {
        return (
        <div className="flex items-center justify-center w-96 h-16 text-4xl px-4 py-2 border border-gray-400 text-gray-700 rounded-md focus:outline-none focus:ring focus:ring-gray-200 mt-12 gray-border">
            <span className='uppercase tracking-widest'>{transaction.code}</span>
        </div> 
        );
    }

    return <></>;
}
