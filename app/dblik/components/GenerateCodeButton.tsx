import { useTransaction } from '@/contexts/TransactionContext';

export function GenerateCodeButton() {
    const { code, init } = useTransaction();

    const handleSubmit = async (e: any) => {
        await init();
    };

    return (
        <>
            {code === undefined
                ? <button
                    className="flex items-center justify-center w-96 h-16 text-xl px-4 py-2 border border-gray-400 text-gray-700 rounded-md hover:shadow-md focus:outline-none focus:ring focus:ring-gray-200 mt-12 gray-border gradient-shadow"
                    onClick={handleSubmit}>
                    <span className='uppercase'>Generate code</span>
                    <style jsx>
                        {`
            .gradient-shadow:hover {
              box-shadow: -15px -15px 50px rgba(255, 105, 180, 0.3), 
                          15px 15px 50px rgba(0, 255, 200, 0.3);
              transition: box-shadow 0.25s ease;
            }
          `}
                    </style>
                </button>
                : <></>
            }
        </>
    );
}
