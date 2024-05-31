import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

export default function Wallets() {
    const { wallets, select, connected } = useWallet();
    const [isClient, setIsClient] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true);
    }, [])

    return !connected && isClient
        ? (
            <div className="flex min-h-screen flex-col items-center mt-16">
                <p className='text-5xl mb-4 text'><span>Connect a wallet</span></p>
                {wallets.map((wallet) =>
                    wallet.readyState === "Installed"
                    ? <button
                        key={wallet.adapter.name}
                        className="flex items-center justify-center w-96 h-16 text-xl px-4 py-2 border border-gray-400 text-gray-700 rounded-md hover:shadow-md focus:outline-none focus:ring focus:ring-gray-200 mt-4"
                        onClick={() => select(wallet.adapter.name)}>
                        <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="w-6 h-6 mr-2" />
                        <span>{wallet.adapter.name}</span>
                    </button>
                    : <button
                        key={wallet.adapter.name}
                        className="disabled:opacity-90 grayscale flex items-center justify-center w-96 h-16 text-xl px-4 py-2 border border-gray-400 text-gray-700 rounded-md focus:outline-none focus:ring focus:ring-gray-200 mt-4"
                        onClick={() => select(wallet.adapter.name)}
                        disabled>
                        <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="w-6 h-6 mr-2" />
                        <span>{wallet.adapter.name} (not installed)</span>
                    </button>
                )}
                <style jsx>{`
                
                .text {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                }

                `}
                </style>
            </div>
        )
        : <></>
}