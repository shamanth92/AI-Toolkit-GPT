'use client';
import Header from '@/components/header';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Summarizer() {
  const [aiSummary, setAISummary] = useState<string>('');
  const [showSpinner, setShowSpinner] = useState(false);

  type FormData = {
    prompt: string;
    tone: string;
    summaryLength: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      tone: 'casual',
      summaryLength: '100',
    },
  });

  const onSubmit = async (data: FormData) => {
    setShowSpinner(true);
    const res = await fetch(`/textSummary`, {
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
      setAISummary(text);
    }
  };

  return (
    <div className="relative h-full bg-[url('/background.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 text-white">
        <div>
          <Header />
          <div className="p-3">
            <p className="text-xl text-green-500">AI Summarizer</p>
            <div className="grid grid-cols-2">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4 pt-2">
                  <p>
                    Enter your text or add an article url here to get your
                    summary
                  </p>
                  <textarea
                    {...register('prompt')}
                    className="w-[40vw] h-60 border-2 border-green-500 rounded-md bg-white text-black"
                  />
                  <div>
                    <label className="block mb-1 font-medium">
                      Select a tone for your response (Casual is default)
                    </label>
                    <select
                      {...register('tone')}
                      className="w-[40vw] border border-green-500 rounded p-2 bg-white text-black"
                    >
                      <option value="casual">Casual</option>
                      <option value="formal">Formal</option>
                      <option value="enthusiastic">Enthusiastic</option>
                      <option value="informative">Informative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Select length of summary (100 words is default)
                    </label>
                    <select
                      {...register('summaryLength')}
                      className="w-[40vw] border border-green-500 rounded p-2 bg-white text-black"
                    >
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="300">300</option>
                    </select>
                  </div>
                  <div>
                    <button
                      className="p-2 bg-green-500 border-1 border-green-500 cursor-pointer"
                      type="submit"
                    >
                      Generate Summary
                    </button>
                  </div>
                </div>
              </form>

              <div className="flex flex-col gap-4">
                <p className="text-xl text-green-500">AI Output</p>

                <div className="border-2 border-green-500 h-full w-full rounded-md p-2 bg-white text-black">
                  {!showSpinner && (
                    <p className="whitespace-pre-wrap text-sm">{aiSummary}</p>
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
        </div>
      </div>
    </div>
  );
}
