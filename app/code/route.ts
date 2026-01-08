import OpenAI from 'openai';
const client = new OpenAI();

export async function POST(request: any): Promise<Response> {
  const getReq = await request.json();
  console.log('getReq: ', getReq);
  const code = getReq?.code;
  const error = getReq?.error;
  const action = getReq?.action;

  const SYSTEM_MESSAGE_IMPROVE = {
    role: 'system',
    content: `You are a Typescript/Javascript code expert and you help review code and improve them and help refactor them. Provide the improved code first and then explain the improvements made.`,
  } as const;

  const SYSTEM_MESSAGE_FIX = {
    role: 'system',
    content: `You are a Typescript/Javascript code expert and you help review code and help fix errors. Provide the fixed code first and then explain what the issue was and what the fix is.`,
  } as const;

  const messages = [
    action === 'improve' ? SYSTEM_MESSAGE_IMPROVE : SYSTEM_MESSAGE_FIX,
    {
      role: 'user',
      content:
        action === 'improve'
          ? code
          : `Fix this error: ${error} in this code: ${code}`,
    } as const,
  ];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = await client.responses.stream({
          model: 'gpt-5.1-codex-max',
          input: messages,
          reasoning: { effort: 'medium' },
        });

        for await (const event of aiStream) {
          if (event.type === 'response.output_text.delta') {
            controller.enqueue(encoder.encode(event.delta));
          }
        }

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
