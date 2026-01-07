'use client';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atelierDuneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '@/components/header';

export default function CodeFixer() {
  const [aiCodeFix, setAICodeFix] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);

  type FormData = {
    code: string;
    error: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData, e: any) => {
    const action = e?.nativeEvent?.submitter?.value;
    setShowSpinner(true);
    const res = await fetch(`/code`, {
      method: 'POST',
      body: JSON.stringify({ ...data, action }),
    });
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let text = '';
    setShowSpinner(false);
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      text += decoder.decode(value);
      setAICodeFix(text);
    }
  };

  return (
    <div>
      <Header />
      <div className="p-3">
        <p className="text-xl text-green-500">AI Code Fixer</p>
        <div className="grid grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 pt-2">
              <p>Paste your code here</p>
              {/* <SyntaxHighlighter language="javascript" style={atelierDuneDark}>
            {codeString}
          </SyntaxHighlighter> */}
              <textarea
                {...register('code')}
                className="w-[40vw] h-100 border-2 border-green-500 rounded-md"
              />
              <p>Enter your error here</p>
              <input
                type="text"
                {...register('error')}
                className="w-full border-2 rounded-md border-green-500"
              />
              <div className="flex flex-row gap-4">
                <button
                  className="p-3 w-50 bg-green-500 rounded-md text-white cursor-pointer"
                  type="submit"
                  name="action"
                  value="fix"
                >
                  Fix error
                </button>
                <button
                  className="p-3 w-50 bg-green-500 rounded-md text-white cursor-pointer"
                  type="submit"
                  name="action"
                  value="improve"
                >
                  Improve Code
                </button>
              </div>
            </div>
          </form>

          <div className="flex flex-col gap-4">
            <p className="text-xl text-green-500">AI Output</p>

            {/* <div className="border-2 border-green-500 h-full w-full rounded-md p-2"> */}
            {!showSpinner && (
              <SyntaxHighlighter language="javascript" style={atelierDuneDark}>
                {aiCodeFix}
              </SyntaxHighlighter>
            )}
            {showSpinner && (
              <div className="inset-0 flex items-center justify-center bg-white/70">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-green-500" />
              </div>
            )}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
