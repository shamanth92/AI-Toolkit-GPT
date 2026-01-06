import OpenAI from 'openai';
const client = new OpenAI();

export async function POST(request: any): Promise<Response> {
  const getReq = await request.json();
  const userText = getReq?.userText;

  const SYSTEM_MESSAGE = {
    role: 'system',
    content: `Your main job is to review a text and make sure has correct grammar. Provide the correct grammar version for the user provided text. Dont change the tone of text or any other parts of text. Just return the correct grammar version of the text. First return the corrected text and then provide what changes were made, highlight the mistakes and corrections. Do not use reasoning`,
  };

  const messages = [SYSTEM_MESSAGE, { role: 'user', content: userText }];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = await client.responses.stream({
          model: 'gpt-5-mini',
          input: messages,
          max_output_tokens: 1500,
        });

        for await (const event of aiStream) {
          //   console.log('event: ', event);
          if (event.type === 'response.output_text.delta') {
            controller.enqueue(encoder.encode(event.delta));
          }

          if (event.type === 'response.completed') {
            controller.enqueue(
              encoder.encode(event.response.output_text ?? '')
            );
          }
        }

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  console.log('stream: ', stream);

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
