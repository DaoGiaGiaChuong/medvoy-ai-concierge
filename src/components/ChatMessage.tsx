import { useState } from "react";
import { Message } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import OptionsGrid from "./OptionsGrid";
import { Option } from "./OptionCard";

interface ChatMessageProps {
  message: Message;
  conversationId: string | null;
}

const ChatMessage = ({ message, conversationId }: ChatMessageProps) => {
  const navigate = useNavigate();

  const handleOptionSelect = (option: Option) => {
    // Check if this is a hospital option (has id that looks like a UUID)
    const isHospital = option.id.length > 10 && option.id.includes("-");
    
    if (isHospital) {
      // Navigate to hospital detail page
      navigate(`/hospital/${option.id}`);
    }
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4 flex-col",
        message.role === "user" ? "items-end" : "items-start"
      )}
    >
      {message.content && (
        <div
          className={cn(
            "max-w-[80%] rounded-lg px-4 py-3",
            message.role === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      )}
      {message.options && message.options.length > 0 && (
        <div className="w-full mt-2">
          <OptionsGrid
            options={message.options}
            onSelectOption={handleOptionSelect}
          />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
