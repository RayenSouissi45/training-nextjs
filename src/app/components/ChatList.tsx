// components/Chat/ChatList.tsx
import { useEffect, useState } from "react";
import { useChat } from "../context/ChatProvider";
import { supabase } from "../../../utils/supabaseClient";

type Conversation = {
  id: number;
  user1_id: number;
  user2_id: number;
  last_message: string;
  last_message_at: string;
};

export default function ChatList() {
  const { selectedChat, setSelectedChat, currentUser } = useChat();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from("conversation_participants")
        .select("conversation_id, conversations(*)")
        .eq("user_id", currentUser);

      if (error) {
        console.error("❌ Failed to fetch conversations:", error.message);
        return;
      }

      if (!data || data.length === 0) {
        console.warn("⚠️ No conversations found.");
      } else {
        // Extract and sort conversations by last_message_at
        const parsedConversations = data
          .map((entry) => entry.conversations)
          .filter(Boolean) // Remove any nulls just in case
          .sort(
            (a, b) => new Date(b.last_message_at) - new Date(a.last_message_at)
          );

        setConversations(parsedConversations);
      }
    };

    if (currentUser) fetchConversations();
  }, [currentUser]);

  return (
    <div className="w-[30%] border-r bg-white overflow-y-auto">
      <div className="p-4">
        <input className="w-full p-2 rounded-md border" placeholder="Search" />
      </div>

      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => setSelectedChat(conv)}
          className={`flex items-center gap-2 p-4 cursor-pointer hover:bg-gray-100 ${
            selectedChat?.id === conv.id ? "bg-gray-200" : ""
          }`}
        >
          <img src="/avatar.png" className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-medium">
              Chat #{conv.user1_id} & {conv.user2_id}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {conv.last_message}
            </div>
          </div>
          <div className="ml-auto text-sm text-gray-400">
            {new Date(conv.last_message_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
