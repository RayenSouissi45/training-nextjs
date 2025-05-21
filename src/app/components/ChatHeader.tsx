// components/Chat/ChatHeader.tsx
import { useEffect, useState } from "react";
import { useChat } from "../context/ChatProvider";

export default function ChatHeader() {
  const { selectedChat } = useChat();
  const [test, setTest] = useState<object | null>(null);
  useEffect(() => {
    setTest({ id: 1, name: "Rayen" });
  }, []);

  return (
    <div className="p-4 border-b flex items-center gap-2 bg-white">
      <img src="/avatar.png" className="w-10 h-10 rounded-full" />
      <div>
        <div className="font-semibold">{selectedChat?.name}</div>
        <div className="text-xs text-green-500">En ligne</div>
      </div>
    </div>
  );
}
