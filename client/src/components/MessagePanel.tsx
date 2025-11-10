import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Send, Bot, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface Message {
  id: string;
  content: string;
  sender: "coach" | "athlete" | "ai";
  timestamp: Date;
}

interface MessagePanelProps {
  clientId?: string;
  clientName?: string;
  clientAvatar?: string;
  role?: "coach" | "athlete";
}

export function MessagePanel({ clientId, clientName, clientAvatar, role = "coach" }: MessagePanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { data: user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Charger les messages depuis localStorage
  useEffect(() => {
    const storageKey = clientId ? `synrgy_messages_${clientId}` : "synrgy_messages_general";
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch {
        // Initialiser avec des messages par défaut
        setMessages([
          {
            id: "1",
            content: role === "coach" 
              ? "Bonjour ! Comment te sens-tu après ta dernière séance ?" 
              : "Salut ! N'hésite pas si tu as des questions.",
            sender: "coach",
            timestamp: new Date(),
          },
        ]);
      }
    } else {
      // Messages initiaux
      setMessages([
        {
          id: "1",
          content: role === "coach" 
            ? "Bonjour ! Comment te sens-tu après ta dernière séance ?" 
            : "Salut ! N'hésite pas si tu as des questions.",
          sender: "coach",
          timestamp: new Date(),
        },
      ]);
    }
  }, [clientId, role]);

  // Auto-scroll vers le bas
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: role === "coach" ? "coach" : "athlete",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);

    // Sauvegarder dans localStorage
    const storageKey = clientId ? `synrgy_messages_${clientId}` : "synrgy_messages_general";
    localStorage.setItem(storageKey, JSON.stringify(updatedMessages));

    setNewMessage("");

    // Simulation réponse IA après 1 seconde
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: role === "coach"
          ? `Merci pour ton retour. Je vais analyser tes données et te proposer un ajustement si nécessaire. 💪`
          : `J'ai bien noté. Continue sur cette lancée, tu progresses bien ! 🎯`,
        sender: "ai",
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);
      localStorage.setItem(storageKey, JSON.stringify(finalMessages));
    }, 1000);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          {clientId && clientAvatar ? (
            <>
              <Avatar className="w-8 h-8">
                <AvatarImage src={clientAvatar} />
                <AvatarFallback>{clientName?.[0]}</AvatarFallback>
              </Avatar>
              <span>{clientName}</span>
            </>
          ) : (
            <span>💬 Communication</span>
          )}
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === (role === "coach" ? "coach" : "athlete") ? "justify-end" : "justify-start"}`}
            >
              {message.sender !== (role === "coach" ? "coach" : "athlete") && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  {message.sender === "ai" ? (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <>
                      <AvatarImage src={clientAvatar} />
                      <AvatarFallback>{clientName?.[0] || "C"}</AvatarFallback>
                    </>
                  )}
                </Avatar>
              )}

              <div className={`max-w-[70%] ${message.sender === (role === "coach" ? "coach" : "athlete") ? "order-first" : ""}`}>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.sender === (role === "coach" ? "coach" : "athlete")
                      ? "bg-primary text-primary-foreground ml-auto"
                      : message.sender === "ai"
                      ? "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              {message.sender === (role === "coach" ? "coach" : "athlete") && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback>{user?.fullName?.[0] || "M"}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={role === "coach" ? "Envoyer un message..." : "Écris ton message..."}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

