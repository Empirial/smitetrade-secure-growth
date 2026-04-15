import { auth } from '@/lib/firebase';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const AI_CHAT_URL = 'https://us-central1-smitetrade-40643.cloudfunctions.net/aiChat';

export async function sendChatMessage(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) throw new Error('You must be signed in to use the AI assistant.');

  const response = await fetch(AI_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
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
    throw new Error((err as any)?.error ?? `Request failed (${response.status})`);
  }

  const data = await response.json();
  return (data.content[0] as { text: string }).text;
}
