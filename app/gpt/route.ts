import OpenAI from 'openai';
const client = new OpenAI();
let chatHistory: { role: 'user' | 'assistant'; content: string }[] = [];
const SYSTEM_MESSAGE = {
  role: 'system',
  content:
    'You are a friendly, concise AI chatbot. Answer directly in 2-4 sentences.',
} as const;

export async function POST(request: any): Promise<Response> {
  const getReq = await request.json();
  const userPrompt = getReq?.prompt;
  const MAX_TURNS = 6;
  chatHistory = chatHistory.slice(-MAX_TURNS * 2);

  const messages = [
    SYSTEM_MESSAGE,
    ...chatHistory,
    { role: 'user', content: userPrompt } as const,
  ];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = await client.responses.stream({
          model: 'gpt-5-mini',
          input: messages,
          max_output_tokens: 500,
        });

        let assistantReply = '';

        for await (const event of aiStream) {
          if (event.type === 'response.output_text.delta') {
            assistantReply += event.delta;
            controller.enqueue(encoder.encode(event.delta));
          }
        }

        chatHistory.push(
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: assistantReply }
        );

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
