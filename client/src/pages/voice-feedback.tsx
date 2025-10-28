import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Volume2, Play, Pause, Download, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { useAppConfig } from "../lib/config";

interface AudioMessage {
  id: string;
  title: string;
  content: string;
  duration: number;
  url?: string;
  createdAt: Date;
}

export default function VoiceFeedbackPage() {
  const [, setLocation] = useLocation();
  const { data: config } = useAppConfig();
  const [messages, setMessages] = useState<AudioMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateAudioMessage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/audio/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }

      const result = await response.json();
      
      const newMessage: AudioMessage = {
        id: Date.now().toString(),
        title: result.title || "Message IA du jour",
        content: result.content || "Continuez vos efforts, vous êtes sur la bonne voie !",
        duration: result.duration || 30,
        url: result.url,
        createdAt: new Date()
      };

      setMessages(prev => [newMessage, ...prev]);
    } catch (err) {
      setError('Erreur lors de la génération du message audio');
    } finally {
      setIsLoading(false);
    }
  };

  const mockGenerateMessage = () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const mockMessages = [
        "Excellent travail aujourd'hui ! Continuez sur cette lancée.",
        "Votre progression est remarquable. Félicitations !",
        "Rappelez-vous : chaque petit pas compte vers votre objectif.",
        "Vous êtes plus fort que vous ne le pensez. Continuez !",
        "La persévérance est la clé du succès. Vous y êtes presque !"
      ];

      const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      
      const newMessage: AudioMessage = {
        id: Date.now().toString(),
        title: "Message IA du jour",
        content: randomMessage,
        duration: 15,
        createdAt: new Date()
      };

      setMessages(prev => [newMessage, ...prev]);
      setIsLoading(false);
    }, 2000);
  };

  const playAudio = (messageId: string) => {
    setIsPlaying(messageId);
    // Simuler la lecture audio
    setTimeout(() => {
      setIsPlaying(null);
    }, 3000);
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🔊 Rétroaction Vocale IA
          </h1>
          <p className="text-muted-foreground">
            Recevez des messages audio personnalisés de votre coach IA
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Générer un message audio
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Obtenez un message audio personnalisé basé sur vos progrès
            </p>
            
            <div className="flex gap-2 justify-center">
              {config?.testMode && (
                <Button onClick={mockGenerateMessage} variant="secondary" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Test démo
                </Button>
              )}
              <Button onClick={generateAudioMessage} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Volume2 className="w-4 h-4 mr-2" />
                )}
                Générer message
              </Button>
            </div>
          </CardContent>
        </Card>

        {messages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Messages audio récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{message.title}</h3>
                      <p className="text-sm text-muted-foreground">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.duration}s • {message.createdAt.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => playAudio(message.id)}
                        variant="outline"
                        size="sm"
                        disabled={isPlaying === message.id}
                      >
                        {isPlaying === message.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2 text-destructive">Erreur</h3>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center gap-4">
          <Button onClick={() => setLocation('/coach/dashboard')} variant="outline">
            Retour au dashboard
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

