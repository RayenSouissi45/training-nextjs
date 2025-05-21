// components/Chat/MessageBubble.tsx
import { useChat } from "../context/ChatProvider";

export default function MessageBubble({ msg }) {
  const { sender_id } = useChat();
  const isOwn = msg.sender.id === sender_id;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md p-3 rounded-xl shadow text-white ${
          isOwn ? "bg-blue-600 text-right" : "bg-gray-500 text-left"
        }`}
      >
        <div className="text-sm mb-1">
          <strong>{msg.sender.name}</strong>
        </div>
        <div>{msg.content}</div>
      </div>
    </div>
  );
}
