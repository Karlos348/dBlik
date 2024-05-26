import { useBalance } from '@/contexts/BalanceContext';
import { useWallet } from '@solana/wallet-adapter-react';
 
export default function WalletHeader() {
    const { balance } = useBalance();
    const { connected, disconnect, publicKey } = useWallet();

    return (
<header className="main-header border-gray-400">
    <div className="container min-h-12">
        <div className="left-section">{connected ? <>Address: {publicKey?.toString()}</> : <></>}</div>
        <div className="center-section">{connected ? <>Balance: {balance.toFixed(4)} SOL</> : <>Disconnected</>}</div>
        <div className="right-section">
            {connected 
            ? 
                <button onClick={() => disconnect()} className="hover:shadow-md rounded-md border border-gray-400">
                    <div className="button-container">
                        <div className="button-text text-gray-700">Disconnect</div>
                    </div>
                </button>
            : <></>}
        </div>
    </div>

          <style jsx>
            {`
.button-container {
    display: flex;
    align-items: center;
    background-color: transparent;
    overflow: hidden;
    width: fit-content;
}

.button-text {
    margin: 10px;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
}

.container {
    display: flex;
    width: 100%;
}

.left-section {
    flex: 1;
    display: flex;
    justify-content: left;
    align-items: center;
    color: black;
}

.center-section {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
}

.right-section {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}


.main-header {
    width: 100%;
    background-color: transparent;
    color: #000;
    padding: 10px 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid rgb(156 163 175 / var(--tw-border-opacity));
}
`}
          </style>
        </header>
    )
}