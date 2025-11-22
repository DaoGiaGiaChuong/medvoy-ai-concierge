import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useToast } from "@/hooks/use-toast";
import { LogOut, RefreshCw, Home, Search, User as UserIcon } from "lucide-react";

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
    if (loading || !user) return;

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
            conversation_id: newConversation.id,
            role: "assistant",
            content: "Hello! I'm your MedVoy AI assistant. I can help you find the perfect medical facility for your needs. What procedure are you interested in, or how can I assist you today?",
          };

          const { data: savedMessage, error: messageError } = await supabase
            .from("messages")
            .insert(welcomeMessage)
            .select()
            .single();

          if (messageError) {
            console.error("Error creating welcome message:", messageError);
          } else if (savedMessage) {
            setMessages([{
              id: savedMessage.id,
              role: "assistant",
              content: savedMessage.content,
              created_at: savedMessage.created_at,
            }]);
          }
        }
      }
    };

    initConversation();
  }, [user, loading, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
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
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to start chatting with our AI medical tourism assistant.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate("/auth")} size="lg">
              Sign In
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" size="lg">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
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
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/explore")}
              className="text-sm"
            >
              <Search className="h-4 w-4 mr-2" />
              Explore
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/profile")}
              className="text-sm"
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Profile
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
            conversationId={conversationId}
            onOptionSelect={handleOptionSelect}
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
