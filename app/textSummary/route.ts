import OpenAI from 'openai';
const client = new OpenAI();

export async function POST(request: any): Promise<Response> {
  const getReq = await request.json();
  console.log('getReq: ', getReq);
  const userPrompt = getReq?.prompt;
  const userTone = getReq?.tone;
  const userSummaryLength = getReq?.summaryLength;

  const SYSTEM_MESSAGE = {
    role: 'system',
    content: `You are a text reviewer. You review large amounts of text and provide concise, short summaries of these texts. Do not include reasoning or analysis. Provide highlights, key points and provide bullet points wherever necessary. The summary should have a ${userTone} tone. The length of the summary should be around ${userSummaryLength}`,
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

        let assistantReply = '';

        for await (const event of aiStream) {
          if (event.type === 'response.output_text.delta') {
            assistantReply += event.delta;
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
