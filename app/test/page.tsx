'use client';
import { useState } from 'react';

export default function Test() {
  const [yes, setYes] = useState(false);
  return (
    <div className="flex flex-col gap-6 p-5 justify-center w-screen items-center">
      <p className="text-5xl font-sans">Will you be my Valentine?</p>
      <img src="/willyou.webp" alt="Loading..." className="h-80 w-80" />
      <div className="flex gap-8">
        <button
          className="h-10 w-20 bg-sky-500 cursor-pointer"
          onClick={() => setYes(true)}
        >
          Yes
        </button>
        <button className="h-10 w-20 bg-sky-500 cursor-pointer" disabled>
          No
        </button>
      </div>
      {yes && (
        <div>
          <img src="/yes.webp" alt="Loading..." className="h-80 w-80" />
        </div>
      )}
    </div>
  );
}
