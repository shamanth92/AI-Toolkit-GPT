import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex justify-center items-center p-3">
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-green-500">
            Select the AI tool you want to explore
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/chatbot">
            <button className="w-full p-5 rounded-md text-white bg-green-500 cursor-pointer">
              AI Chatbot
            </button>
          </Link>
          <Link href="/summarizer">
            <button className="w-full p-5 rounded-md text-white bg-green-500 cursor-pointer">
              AI Summarizer
            </button>
          </Link>
          <button className="p-5 rounded-md text-white bg-green-500 cursor-pointer">
            AI Email Help
          </button>
          <Link href="/grammarCheck">
            <button className="w-full p-5 rounded-md text-white bg-green-500 cursor-pointer">
              AI Grammar Check
            </button>
          </Link>
          <Link href="/codeFixer">
            <button className="w-full p-5 rounded-md text-white bg-green-500 cursor-pointer">
              AI Code Explainer
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
