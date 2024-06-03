import { useBalance } from '@/contexts/BalanceContext';
import { useWallet } from '@solana/wallet-adapter-react';
 
export default function WalletHeader() {
    const { balance } = useBalance();
    const { connected, disconnect, publicKey } = useWallet();

    return (
        <header className="w-full bg-transparent text-black py-2 px-4 border-b border-gray-400 flex items-center justify-center min-h-16">
            <div className="w-full flex flex-col md:flex-row items-center justify-between">
                <div className="flex-1 flex items-center justify-start">
                    {connected ? <>Address: {publicKey?.toString()}</> : <></>}
                </div>
                <div className="flex-1 flex items-center justify-center my-2 md:my-0">
                    {connected 
                        ? balance === undefined
                            ? <>Retrieving balance...</>
                            : <>Balance: {balance?.toFixed(4)} SOL</>
                        : <>Disconnected</>}
                </div>
                <div className="flex-1 flex items-center justify-end">
                    {connected 
                        ? <button onClick={() => disconnect()} className="hover:shadow-md rounded-md border border-gray-400 text-gray-700 uppercase py-2 px-4">
                            Disconnect
                        </button>
                        : <></>}
                </div>
            </div>
        </header>
    )
}