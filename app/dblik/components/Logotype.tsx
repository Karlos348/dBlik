import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image'
 
export default function Logotype() {
    const { publicKey } = useWallet();

    return (
<div className="flex items-center justify-center mt-6">
    <Image
        className={`relative ${publicKey == null ? 'grayscale' : ''}`}
        src="/logo.png"
        alt="dBlik"
        width={150}
        height={150}
        priority
    />
</div>
    )
}