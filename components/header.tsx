import Link from 'next/link';

export default function Header() {
  return (
    <div className="h-12 bg-green-500 flex justify-center items-center">
      <Link href="/">
        <button className="text-white text-xl cursor-pointer">
          AI Toolkit GPT
        </button>
      </Link>
    </div>
  );
}
