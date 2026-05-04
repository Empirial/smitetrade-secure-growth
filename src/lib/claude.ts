export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const NVIDIA_API_URL = 'https://integrate.developer.nvidia.com/v1/chat/completions';
const NVIDIA_MODEL = 'meta/llama-3.3-70b-instruct';

export async function sendChatMessage(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_NVIDIA_API_KEY;
  if (!apiKey) throw new Error('NVIDIA API key not configured.');

  const response = await fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: NVIDIA_MODEL,
      max_tokens: 768,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any)?.message ?? `Request failed (${response.status})`);
  }

  const data = await response.json();
  return data.choices[0].message.content as string;
}
