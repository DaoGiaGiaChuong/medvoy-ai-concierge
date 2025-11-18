import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageSquare, Settings, Home, Search, Trash2, LogOut } from "lucide-react";

interface FavoriteHospital {
  id: string;
  hospital_id: string;
  created_at: string;
  hospitals: {
    id: string;
    name: string;
    location: string;
    country: string;
    price_range: string;
    rating: number | null;
    image_url: string | null;
  };
}

interface Conversation {
  id: string;
  created_at: string;
  status: string;
  message_count?: number;
}

interface UserPreferences {
  id?: string;
  preferred_countries: string[];
  preferred_procedures: string[];
  budget_range: string | null;
  notifications_enabled: boolean;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteHospital[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferred_countries: [],
    preferred_procedures: [],
    budget_range: null,
    notifications_enabled: true,
  });
  const [countriesInput, setCountriesInput] = useState("");
  const [proceduresInput, setProceduresInput] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadFavorites();
      loadConversations();
      loadPreferences();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_favorites")
      .select(`
        id,
        hospital_id,
        created_at,
        hospitals (
          id,
          name,
          location,
          country,
          price_range,
          rating,
          image_url
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading favorites:", error);
    } else {
      setFavorites(data || []);
    }
  };

  const loadConversations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("conversations")
      .select("id, created_at, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading conversations:", error);
    } else {
      // Get message counts for each conversation
      const conversationsWithCounts = await Promise.all(
        (data || []).map(async (conv) => {
          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conv.id);
          return { ...conv, message_count: count || 0 };
        })
      );
      setConversations(conversationsWithCounts);
    }
  };

  const loadPreferences = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading preferences:", error);
    } else if (data) {
      setPreferences(data);
      setCountriesInput(data.preferred_countries?.join(", ") || "");
      setProceduresInput(data.preferred_procedures?.join(", ") || "");
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("id", favoriteId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove favorite",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Hospital removed from favorites",
      });
      loadFavorites();
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    const preferencesData = {
      user_id: user.id,
      preferred_countries: countriesInput
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c),
      preferred_procedures: proceduresInput
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p),
      budget_range: preferences.budget_range,
      notifications_enabled: preferences.notifications_enabled,
    };

    const { error } = preferences.id
      ? await supabase
          .from("user_preferences")
          .update(preferencesData)
          .eq("id", preferences.id)
      : await supabase.from("user_preferences").insert(preferencesData);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Preferences saved successfully",
      });
      loadPreferences();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
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
            Please sign in to view your profile.
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1
            className="text-2xl font-bold text-primary cursor-pointer"
            onClick={() => navigate("/")}
          >
            MedVoy AI
          </h1>
          <div className="flex gap-4 items-center">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate("/explore")}>
              <Search className="h-4 w-4 mr-2" />
              Explore
            </Button>
            <Button variant="ghost" onClick={() => navigate("/chat")}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </nav>
      </header>

      {/* Profile Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your favorites, chat history, and preferences
          </p>
        </div>

        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="favorites">
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="history">
              <MessageSquare className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4">
            {favorites.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    No favorite hospitals yet
                  </p>
                  <Button onClick={() => navigate("/explore")}>
                    <Search className="mr-2 h-4 w-4" />
                    Explore Hospitals
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {favorites.map((favorite) => (
                  <Card key={favorite.id} className="overflow-hidden">
                    {favorite.hospitals.image_url && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={favorite.hospitals.image_url}
                          alt={favorite.hospitals.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl">
                        {favorite.hospitals.name}
                      </CardTitle>
                      <CardDescription>
                        {favorite.hospitals.location}, {favorite.hospitals.country}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary">
                          {favorite.hospitals.price_range}
                        </Badge>
                        {favorite.hospitals.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium">
                              {favorite.hospitals.rating}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            navigate(`/hospital/${favorite.hospitals.id}`)
                          }
                          className="flex-1"
                          variant="outline"
                        >
                          View Details
                        </Button>
                        <Button
                          onClick={() => removeFavorite(favorite.id)}
                          variant="destructive"
                          size="icon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Chat History Tab */}
          <TabsContent value="history" className="space-y-4">
            {conversations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    No chat history yet
                  </p>
                  <Button onClick={() => navigate("/chat")}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Chatting
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <Card key={conversation.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Conversation from{" "}
                          {new Date(conversation.created_at).toLocaleDateString()}
                        </CardTitle>
                        <Badge
                          variant={
                            conversation.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {conversation.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {conversation.message_count} message
                        {conversation.message_count !== 1 ? "s" : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => navigate("/chat")}
                        variant="outline"
                        className="w-full"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Continue Chat
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>My Preferences</CardTitle>
                <CardDescription>
                  Update your preferences to get better recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="countries">Preferred Countries</Label>
                  <Input
                    id="countries"
                    placeholder="e.g., Thailand, Singapore, India"
                    value={countriesInput}
                    onChange={(e) => setCountriesInput(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Separate multiple countries with commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="procedures">Preferred Procedures</Label>
                  <Input
                    id="procedures"
                    placeholder="e.g., Dental, Cosmetic Surgery, IVF"
                    value={proceduresInput}
                    onChange={(e) => setProceduresInput(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Separate multiple procedures with commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Input
                    id="budget"
                    placeholder="e.g., $5,000 - $15,000"
                    value={preferences.budget_range || ""}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        budget_range: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your inquiries
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={preferences.notifications_enabled}
                    onCheckedChange={(checked) =>
                      setPreferences({
                        ...preferences,
                        notifications_enabled: checked,
                      })
                    }
                  />
                </div>

                <Button onClick={savePreferences} className="w-full">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
