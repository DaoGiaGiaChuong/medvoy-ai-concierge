import { Message } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import OptionsGrid from "./OptionsGrid";
import EstimateCard from "./EstimateCard";

interface ChatMessageProps {
  message: Message;
  onSelectOption?: (option: any) => void;
}

const ChatMessage = ({ message, onSelectOption }: ChatMessageProps) => {
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
      {message.estimate && (
        <div className="w-full mt-4">
          <EstimateCard estimate={message.estimate} />
        </div>
      )}
      {message.options && message.options.length > 0 && (
        <div className="w-full mt-2">
          <OptionsGrid
            options={message.options}
            onSelectOption={onSelectOption}
          />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
