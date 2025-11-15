import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type Option = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: string;
  badge?: string;
};

export type Message = {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
  options?: Option[];
};

export const useChat = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!conversationId) return;

      const newUserMessage: Message = {
        role: "user",
        content: userMessage,
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setIsLoading(true);

      try {
        // Save user message to database
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "user",
          content: userMessage,
        });

        const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/medvoy-chat`;
        const response = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, newUserMessage],
            conversationId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get response");
        }

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = "";
        let assistantContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              const options = parsed.choices?.[0]?.delta?.options;
              
              if (content) {
                assistantContent += content;
              }
              
              setMessages((prev) => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 
                      ? { ...m, content: assistantContent, options: options || m.options } 
                      : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent, options }];
              });
            } catch (parseError) {
              console.error("Parse error:", parseError);
            }
          }
        }

        // Save assistant message to database
        if (assistantContent) {
          await supabase.from("messages").insert({
            conversation_id: conversationId,
            role: "assistant",
            content: assistantContent,
          });
        }
      } catch (error: any) {
        console.error("Chat error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to send message",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, messages, toast]
  );

  return {
    messages,
    setMessages,
    isLoading,
    sendMessage,
  };
};
