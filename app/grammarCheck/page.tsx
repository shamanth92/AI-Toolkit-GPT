'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function GrammarCheck() {
  const [aiGrammar, setAIGrammar] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);

  type FormData = {
    userText: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setShowSpinner(true);
    const res = await fetch(`/grammar`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let text = '';
    setShowSpinner(false);
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      text += decoder.decode(value);
      setAIGrammar(text);
    }
  };

  return (
    <div className="p-3">
      <p className="text-xl text-green-500">AI Grammar Check</p>
      <div className="grid grid-cols-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 pt-2">
            <p>Enter your text here</p>
            <textarea
              {...register('userText')}
              className="w-[40vw] h-100 border-2 border-green-500 rounded-md"
            />
            <button className="p-3 bg-green-500 w-50 rounded-md cursor-pointer text-white">
              Grammar Check
            </button>
          </div>
        </form>
        <div className="flex flex-col gap-4">
          <p className="text-xl text-green-500">AI Output</p>

          <div className="border-2 border-green-500 h-full w-full rounded-md p-2">
            {!showSpinner && (
              <p className="whitespace-pre-wrap text-sm">{aiGrammar}</p>
            )}
            {showSpinner && (
              <div className="inset-0 flex items-center justify-center bg-white/70">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-green-500" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
