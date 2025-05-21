// types/chat.ts
export interface Message {
  id: number;
  content: string;
  created_at: string;
  sender: { id: number; name: string };
  receiver: { id: number; name: string };
}

export interface Chat {
  id: number;
  name: string;
}
