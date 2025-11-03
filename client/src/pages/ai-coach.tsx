import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User as UserIcon, Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

const suggestedPrompts = [
  "Quels ajustements proposer après 6 semaines de déficit ?",
  "Planifie un micro-cycle de force pour un athlète intermédiaire",
  "Quel refeed structurer pour relancer la récupération ?",
  "Propose un échauffement ciblé avant un 5RM squat",
];

export default function AICoach() {
  const { toast } = useToast();
  const { data: user } = useAuth();
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/history"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/chat/history");
      const data = await response.json();
      return data.history ?? [];
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/chat", { message: content });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/history"] });
      setInputMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le message",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed) return;
    sendMessageMutation.mutate(trimmed);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessageMutation.mutate(prompt);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMessageMutation.isPending]);

  return (
    <div className="flex h-screen flex-col p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              Coach IA Synrgy
            </h1>
            <p className="text-sm text-muted-foreground">
              Dialogue en temps réel avec le cerveau tactique Synrgy
            </p>
          </div>
        </div>
        {user && (
          <Badge variant="outline" className="uppercase tracking-wide">
            {user.role === "coach" ? "Coach" : "Athlète"}
          </Badge>
        )}
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardHeader className="border-b border-border py-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Fil de conversation stratégique
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6">
                  <Sparkles className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Commence une session</h3>
                <p className="mb-6 max-w-md text-sm text-muted-foreground">
                  Pose une question sur l'entraînement, la récupération ou la nutrition : le coach IA répond avec la doctrine Synrgy complète.
                </p>
                <div className="grid max-w-2xl grid-cols-1 gap-3 md:grid-cols-2">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      className="rounded-lg border border-border p-3 text-left text-sm transition hover:shadow-md"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="mt-1 h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-md rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      <p className="mt-1 text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="mt-1 h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {sendMessageMutation.isPending && (
                  <div className="flex gap-3">
                    <Avatar className="mt-1 h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-2xl bg-muted px-4 py-3">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="border-t border-border p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                placeholder="Pose ta question : charges, nutrition, planning..."
                disabled={sendMessageMutation.isPending}
              />
              <Button type="submit" disabled={sendMessageMutation.isPending}>
                <Send className="mr-2 h-4 w-4" />
                Envoyer
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

