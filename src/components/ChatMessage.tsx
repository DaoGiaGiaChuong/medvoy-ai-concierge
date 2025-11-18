import { useState } from "react";
import { Message } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import OptionsGrid from "./OptionsGrid";
import EstimateCard from "./EstimateCard";
import ConsultationDialog from "./ConsultationDialog";
import { Option } from "./OptionCard";

interface ChatMessageProps {
  message: Message;
  conversationId: string | null;
}

const ChatMessage = ({ message, conversationId }: ChatMessageProps) => {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleOptionSelect = (option: Option) => {
    // Check if this is a hospital option (has id that looks like a UUID)
    const isHospital = option.id.length > 10 && option.id.includes("-");
    
    if (isHospital) {
      setSelectedHospital({
        id: option.id,
        name: option.title,
      });
      setConsultationOpen(true);
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
      {message.estimate && (
        <div className="w-full mt-4">
          <EstimateCard estimate={message.estimate} />
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
      
      {selectedHospital && (
        <ConsultationDialog
          open={consultationOpen}
          onOpenChange={setConsultationOpen}
          hospitalId={selectedHospital.id}
          hospitalName={selectedHospital.name}
          conversationId={conversationId}
        />
      )}
    </div>
  );
};

export default ChatMessage;
