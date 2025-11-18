import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useToast } from "@/hooks/use-toast";
import { LogOut, RefreshCw, Calculator, Home, Search } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, setMessages, isLoading, sendMessage } = useChat(conversationId);

  useEffect(() => {
    console.log("Setting up auth listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      console.log("No user found, redirecting to auth");
      navigate("/auth");
      return;
    }

    console.log("User authenticated, initializing conversation for:", user.id);

    const initConversation = async () => {
      console.log("Fetching existing conversations...");
      const { data: existingConversations, error: fetchError } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error("Error fetching conversations:", fetchError);
        return;
      }

      console.log("Existing conversations:", existingConversations?.length);

      if (existingConversations && existingConversations.length > 0) {
        const conversation = existingConversations[0];
        console.log("Loading existing conversation:", conversation.id);
        setConversationId(conversation.id);

        const { data: existingMessages, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversation.id)
          .order("created_at", { ascending: true });

        if (messagesError) {
          console.error("Error fetching messages:", messagesError);
        } else if (existingMessages) {
          console.log("Loaded messages:", existingMessages.length);
          setMessages(existingMessages.map(msg => ({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            content: msg.content,
            created_at: msg.created_at,
          })));
        }
      } else {
        console.log("Creating new conversation...");
        const { data: newConversation, error: createError } = await supabase
          .from("conversations")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (createError) {
          console.error("Error creating conversation:", createError);
          toast({
            title: "Error",
            description: "Failed to initialize chat",
            variant: "destructive",
          });
        } else if (newConversation) {
          console.log("New conversation created:", newConversation.id);
          setConversationId(newConversation.id);
          
          const welcomeMessage = {
            role: "assistant" as const,
            content: "Welcome to MedVoy! I'm here to help you find transparent, personalized cost estimates for medical travel. To get started, could you tell me what medical procedure you're interested in?",
          };
          
          await supabase.from("messages").insert({
            conversation_id: newConversation.id,
            role: "assistant",
            content: welcomeMessage.content,
          });
          
          console.log("Welcome message inserted");
          setMessages([welcomeMessage]);
        }
      }
    };

    initConversation();
  }, [user, loading, navigate, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleRestart = async () => {
    if (!user) return;

    console.log("Restarting conversation...");
    
    // Create new conversation
    const { data: newConversation, error: createError } = await supabase
      .from("conversations")
      .insert({ user_id: user.id })
      .select()
      .single();

    if (createError) {
      console.error("Error creating conversation:", createError);
      toast({
        title: "Error",
        description: "Failed to restart chat",
        variant: "destructive",
      });
      return;
    }

    if (newConversation) {
      console.log("New conversation created:", newConversation.id);
      setConversationId(newConversation.id);
      
      const welcomeMessage = {
        role: "assistant" as const,
        content: "Welcome to MedVoy! I'm here to help you find transparent, personalized cost estimates for medical travel. To get started, could you tell me what medical procedure you're interested in?",
      };
      
      await supabase.from("messages").insert({
        conversation_id: newConversation.id,
        role: "assistant",
        content: welcomeMessage.content,
      });
      
      setMessages([welcomeMessage]);
      
      toast({
        title: "Chat restarted",
        description: "Starting a fresh conversation",
      });
    }
  };

  const handleOptionSelect = async (option: any) => {
    console.log("Option selected:", option);
    await sendMessage(option.title);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b bg-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold">MedVoy AI</h1>
            <p className="text-sm text-muted-foreground">Transparent Medical Tourism</p>
          </div>
          <nav className="flex gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="text-sm"
            >
              Chat
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/explore")}
              className="text-sm"
            >
              Explore
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/cost-breakdown")}
              className="text-sm flex items-center gap-2"
            >
              <Calculator className="h-4 w-4" />
              Cost Estimate
            </Button>
          </nav>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRestart} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Restart Chat
          </Button>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage 
            key={message.id || index} 
            message={message}
            onSelectOption={handleOptionSelect}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-3">
              <p className="text-muted-foreground">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
};

export default Index;
