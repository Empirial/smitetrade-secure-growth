export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendChatMessage(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
  if (!apiKey) throw new Error('Add VITE_CLAUDE_API_KEY to your .env file');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message ?? `API error ${response.status}`);
  }

  const data = await response.json();
  return (data.content[0] as { text: string }).text;
}
