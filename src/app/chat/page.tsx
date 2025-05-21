// app/chat/[conversationId]/page.tsx
"use client";

import { ChatProvider } from "../context/ChatProvider";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const { conversationId } = useParams();

  return (
    <ChatProvider conversationId={conversationId}>
      <div className="flex h-screen">
        <ChatList />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}
