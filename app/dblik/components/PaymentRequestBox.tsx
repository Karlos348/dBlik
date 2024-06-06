import { useTransaction } from '@/contexts/TransactionContext';
import { TransactionState } from '@/models/transaction';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export function PaymentRequestBox() {
    const { transaction, confirm, cancel, closeTransactionAccount } = useTransaction();

    const handleConfirm = async (e: any) => {
        await confirm();
    };

    const handleCancel = async (e: any) => {
        await cancel();
    };

    const handleCloseAccount = async (e: any) => {
        await closeTransactionAccount();
    };

    const amount = Number(transaction?.amount) / LAMPORTS_PER_SOL;

    switch (transaction?.state) {
        case TransactionState.Canceled:
            return (
                <div className="w-96 mx-auto mt-12 p-6 border border-gray-400 rounded-md shadow-lg">
                    <p className="text-m uppercase text-center tracking-wide">message</p>
                    <p className="text-xl mb-4 text-center">{transaction?.message}</p>
                    <p className="text-m uppercase text-center tracking-wide">amount</p>
                    <p className="text-xl mb-4 text-center">{amount} SOL</p>
                    <h2 className="text-xl uppercase tracking-widest text-center">Transaction canceled</h2>
                </div>
            );

        case TransactionState.Pending:
            return (
                <div className="box w-96 mx-auto mt-12 p-6 border border-gray-400 rounded-md shadow-lg">
                    <h2 className="text-2xl uppercase tracking-widest mb-4 text-center">payment request</h2>
                    <p className="text-m uppercase text-center tracking-wide">message</p>
                    <p className="text-xl mb-4 text-center">{transaction?.message}</p>
                    <p className="text-m uppercase text-center tracking-wide">amount</p>
                    <p className="text-xl mb-4 text-center">{amount} SOL</p>
                    <div className="flex justify-around mt-6">
                        <button
                            onClick={handleCancel}
                            className="mr-2 flex items-center justify-center w-44 h-12 text-xl px-4 py-2 border border-gray-400 text-gray-700 rounded-md hover:shadow-md focus:outline-none focus:ring focus:ring-gray-200 transition-shadow duration-250"
                        >
                            <span className="uppercase">Cancel</span>
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="ml-2 flex items-center justify-center w-44 h-12 text-xl px-4 py-2 border border-gray-400 text-gray-700 rounded-md hover:shadow-md focus:outline-none focus:ring focus:ring-gray-200 transition-shadow duration-250"
                        >
                            <span className="uppercase">Confirm</span>
                        </button>
                    </div>
                    <style jsx>{`
            .box {
                box-shadow: -15px -15px 50px rgba(255, 105, 180, 0.3), 
                            15px 15px 50px rgba(0, 255, 200, 0.3);
                transition: box-shadow 0.25s ease;
            }
        `}</style>
                </div>
            );

        case TransactionState.Succeed:
            return (
                <div className="box w-96 mx-auto mt-12 p-6 border border-gray-400 rounded-md shadow-lg">
                    <p className="text-m uppercase text-center tracking-wide">message</p>
                    <p className="text-xl mb-4 text-center">{transaction?.message}</p>
                    <p className="text-m uppercase text-center tracking-wide">amount</p>
                    <p className="text-xl mb-4 text-center">{amount} SOL</p>
                    <h2 className="text-xl uppercase tracking-widest text-center">Transaction completed successfully</h2>
                    <style jsx>{`
.box {
    box-shadow: -15px -15px 50px rgba(255, 105, 180, 0.3), 
                15px 15px 50px rgba(0, 255, 200, 0.3);
    transition: box-shadow 0.25s ease;
}
`}</style>
                </div>
            );

        case TransactionState.Initialized:
            return (
                <div className="w-96 mx-auto mt-12 p-6 border border-gray-400 rounded-md shadow-lg">
                    <h2 className="text-2xl uppercase tracking-widest mb-4 text-center">waiting for payment request</h2>
                    <div className="flex justify-around mt-6">
                        <button
                            onClick={handleCloseAccount}
                            className="mr-2 flex items-center justify-center w-44 h-12 text-xl px-4 py-2 border border-gray-400 text-gray-700 rounded-md hover:shadow-md focus:outline-none focus:ring focus:ring-gray-200 transition-shadow duration-250"
                        >
                            <span className="uppercase">Cancel</span>
                        </button>
                    </div>
                </div>
            );

        default:
            return (<></>)
    };
}
