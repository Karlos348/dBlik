import Image from 'next/image'
 
export default function Logotype() {
    return (
<div className="flex items-center justify-center mt-6">
    <Image
        className="relative"
        src="/logo.png"
        alt="dBlik"
        width={150}
        height={150}
        priority
    />
</div>
    )
}