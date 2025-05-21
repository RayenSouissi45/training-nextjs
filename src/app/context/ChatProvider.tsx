// context/ChatProvider.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { Chat, Message } from "../types/chat";

const ChatContext = createContext(null);

export function ChatProvider({ children, conversationId }: any) {
  const [selectedChatId, setSelectedChatId] = useState(conversationId);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadCounter, setLoadCounter] = useState(1);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const sender_id = "30ca762a-e858-40ad-ad53-5c9581cf6d10"; // Hardcoded for now
  const currentUser = "30ca762a-e858-40ad-ad53-5c9581cf6d10";
  // Fetch messages when chat is selected
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `id, content, created_at, message_type, sender:sender_id(id, name)`
        )
        .eq("conversation_id", selectedChat.id)
        .order("created_at", { ascending: false }) // latest first
        .limit(50); // or whatever count you'd like

      if (error) {
        console.error("❌ Failed to fetch messages:", error.message);
        return;
      }

      if (data) {
        const sorted = data.reverse(); // to display oldest at top
        setMessages(sorted);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  // Realtime listener
  useEffect(() => {
    if (!selectedChat) return;

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedChat.id}`,
        },
        async (payload) => {
          const { data, error } = await supabase
            .from("messages")
            .select(`id, content, created_at, sender:sender_id(id, name)`)
            .eq("id", payload.new.id)
            .single();

          if (error || !data) return;

          setMessages((prev) => [...prev, data]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChat]);

  useEffect(() => {
    setLoadCounter(1);
  }, [selectedChat]);
  // b9at ken l fct hedhi
  const loadOlderMessages = async () => {
    if (!selectedChat) return;
    setLoadingOlder(true);

    const messagesPerPage = 10;
    const from = loadCounter * messagesPerPage;
    const to = from + messagesPerPage - 1;

    const { data, error } = await supabase
      .from("messages")
      .select(`id, content, created_at, sender:sender_id(id, name)`)
      .eq("conversation_id", selectedChat.id)
      .order("created_at", { ascending: false })
      .range(from, to);

    setLoadingOlder(false);

    if (error) {
      console.error("❌ Error loading older messages:", error.message);
      return;
    }

    const sorted = data?.reverse(); // Oldest to newest

    if (sorted && sorted.length > 0) {
      setMessages((prev) => [...sorted, ...prev]); // Prepend older
      setLoadCounter((prev) => prev + 1);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        currentUser,
        messages,
        setMessages,
        sender_id,
        loadOlderMessages,
        loadingOlder,
        selectedChatId,
        setSelectedChatId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
