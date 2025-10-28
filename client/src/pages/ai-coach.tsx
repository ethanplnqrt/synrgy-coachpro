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
import type { Message, User } from "@shared/schema";
import { useAppConfig } from "../lib/config";

const suggestedPrompts = [
  "Comment améliorer ma technique de squat ?",
  "Quels sont les meilleurs exercices pour les abdominaux ?",
  "Comment éviter les blessures pendant l'entraînement ?",
  "Conseils pour ma nutrition sportive",
];

export default function AICoach() {
  const { toast } = useToast();
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: config } = useAppConfig();
  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: config?.testMode ? ["demo/messages"] : ["/api/messages"],
    enabled: !config?.testMode,
  });
  const [demoMessages, setDemoMessages] = useState<{ id: string; role: "user" | "assistant"; content: string; createdAt: string; }[]>([]);

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (config?.testMode) {
        // call lightweight ask endpoint
        const res = await apiRequest("POST", "/api/ask", { content });
        return res.json();
      }
      const res = await apiRequest("POST", "/api/messages", { content });
      return res.json();
    },
    onSuccess: (data) => {
      if (config?.testMode) {
        const now = new Date().toISOString();
        setDemoMessages((prev) => [
          ...prev,
          { id: Math.random().toString(36).slice(2), role: "user", content: inputMessage, createdAt: now },
          { id: Math.random().toString(36).slice(2), role: "assistant", content: data.reply || "", createdAt: now },
        ]);
        setInputMessage("");
      } else {
        queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
        setInputMessage("");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le message",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessageMutation.mutate(inputMessage.trim());
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessageMutation.mutate(prompt);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col p-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold" data-testid="text-page-title">
              Coach IA
            </h1>
            <p className="text-muted-foreground text-sm">
              Posez vos questions sur l'entraînement et la nutrition
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (config?.testMode ? demoMessages.length === 0 : messages.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 rounded-full mb-4">
                <Sparkles className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Commencez une conversation</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Posez des questions sur vos entraînements, la nutrition, ou demandez des conseils personnalisés
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="p-3 text-left text-sm rounded-lg border border-border hover-elevate active-elevate-2"
                    data-testid={`button-suggested-prompt-${index}`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {(config?.testMode ? demoMessages : messages).map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`message-${message.role}-${message.id}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="w-8 h-8 mt-1 shrink-0">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <Bot className="w-4 h-4" />
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
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="w-8 h-8 mt-1 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <UserIcon className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {sendMessageMutation.isPending && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 mt-1 shrink-0">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </CardContent>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Posez votre question..."
              disabled={sendMessageMutation.isPending}
              className="flex-1"
              data-testid="input-message"
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || sendMessageMutation.isPending}
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
