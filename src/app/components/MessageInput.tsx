// components/Chat/MessageInput.tsx
import { useForm } from "react-hook-form";
import { supabase } from "../../../utils/supabaseClient";
import { useChat } from "../context/ChatProvider";

export default function MessageInput() {
  const { sender_id, selectedChat } = useChat();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    if (!data.content) return;

    const { error } = await supabase.from("messages").insert([
      {
        content: data.content,
        sender_id: sender_id, // assumed to be defined
        conversation_id: selectedChat?.id, // must not be undefined
        message_type: "text", // required field
      },
    ]);

    if (error) {
      console.error("❌ Failed to send message:", error.message);
      return;
    }

    reset(); // Clear the form after successful insert
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 flex gap-2 border-t bg-white"
    >
      <input
        {...register("content", { required: true })}
        className="flex-1 p-2 border rounded-md"
        placeholder="Type your message..."
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
        Send
      </button>
    </form>
  );
}
