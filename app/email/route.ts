import OpenAI from 'openai';
const client = new OpenAI();

export async function POST(request: any): Promise<Response> {
  const getReq = await request.json();
  console.log('getReq: ', getReq);
  const userPrompt = getReq?.prompt;
  const userTone = getReq?.tone;
  const userEmailLength = getReq?.emailLength;

  const SYSTEM_MESSAGE = {
    role: 'system',
    content: `You are a email writing guru, an expert at writing emails for any scenario or situation. Read the context provided by the user and provide an email as per the context. The email should have a ${userTone} tone. The length of the email should be around ${userEmailLength}`,
  };

  const messages = [SYSTEM_MESSAGE, { role: 'user', content: userPrompt }];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = await client.responses.stream({
          model: 'gpt-5-mini',
          input: messages,
          max_output_tokens: 800,
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
