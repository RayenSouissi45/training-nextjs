import { useRef, useEffect, useLayoutEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { useChat } from "../context/ChatProvider";

export default function ChatWindow() {
  const { selectedChat, messages, loadOlderMessages, loadingOlder } = useChat();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const prevMessageCount = useRef<number>(0);

  // Scroll to bottom when chat is first opened
  useLayoutEffect(() => {
    if (!initialScrollDone && messages.length > 0) {
      scrollToBottom();
      setInitialScrollDone(true);
    }
  }, [messages, initialScrollDone]);

  // Preserve scroll position when older messages are loaded
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && !loadingOlder) {
        const prevScrollHeight = container.scrollHeight;
        loadOlderMessages().then(() => {
          requestAnimationFrame(() => {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - prevScrollHeight;
          });
        });
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loadOlderMessages, loadingOlder]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: "auto" });
    });
  };

  return (
    <div className="flex flex-col w-[70%] h-full">
      <ChatHeader />
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id + "-" + Math.random()} msg={msg} />
        ))}
        <div ref={endRef} />
      </div>
      <MessageInput />
      {loadingOlder && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 flex items-center gap-2 z-10">
          <svg
            className="animate-spin h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>Loading older messages...</span>
        </div>
      )}
    </div>
  );
}
