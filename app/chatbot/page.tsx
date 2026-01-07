'use client';
import Header from '@/components/header';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Chatbot() {
  const [aiText, setAIText] = useState([]);
  const [userPrompt, setUserPrompt] = useState([]);

  type FormData = {
    prompt: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setUserPrompt([...userPrompt, { q: data.prompt }]);
    setAIText((prev) => [...prev, '']);
    reset();

    const res = await fetch(`/gpt`, {
      method: 'POST',
      body: JSON.stringify({ prompt: data.prompt }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    let text = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      text += decoder.decode(value);
      setAIText((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = text; // overwrite last stream only
        return updated;
      });
    }
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center gap-6 flex-col pt-4">
        <div className="w-100 flex flex-col">
          <div className="w-full h-8 bg-green-500 border-1 border-green-500">
            <p className="text-white text-center">AI Chatbot</p>
          </div>
          <div className="w-full h-100 border-1 border-green-500 bg-grey-500 p-2 overflow-y-auto">
            {userPrompt?.map((text, index) => (
              <div className="flex flex-col gap-4 pb-2" key={index}>
                <div className="w-80 border-1 border-gray-200 bg-gray-200 rounded-md p-1">
                  <p>{text?.q}</p>
                </div>
                {aiText[index] && (
                  <div className="flex justify-end w-full">
                    <div className="w-80 border-1 border-green-500 bg-green-500 rounded-md p-1">
                      <p className="text-white">{aiText[index]}</p>
                    </div>
                  </div>
                )}
                {!aiText[index] && (
                  <div className="inset-0 flex items-center justify-center bg-white/70">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-green-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex">
                <input
                  type="text"
                  {...register('prompt', { required: 'Prompt is required' })}
                  className="border-1 border-green-500 w-full h-20"
                ></input>
                {errors.prompt && (
                  <p className="text-red-500 text-sm">
                    {errors.prompt.message}
                  </p>
                )}
                <button
                  type="submit"
                  className="h-20 text-white bg-green-500 cursor-pointer"
                >
                  Generate text
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
