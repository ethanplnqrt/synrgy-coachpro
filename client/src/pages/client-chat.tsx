import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { Send, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: string;
}

export default function ClientChat() {
  const { data: user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'coach',
      content: 'Salut ! Comment s\'est passé ton entraînement aujourd\'hui ?',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '2',
      role: 'user',
      content: 'Très bien ! Je me sens plus fort sur le développé couché.',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: '3',
      role: 'coach',
      content: 'Super ! Continue sur cette lancée. N\'oublie pas de bien récupérer entre les séries.',
      timestamp: new Date(Date.now() - 900000).toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const coach = {
    name: 'Alexandre Dubois',
    avatar: 'https://ui-avatars.com/api/?name=Alexandre+Dubois&background=FF6B3D&color=fff'
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: inputMessage,
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      
      // Simulate coach response
      setTimeout(() => {
        const coachResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'coach',
          content: 'Merci pour ton retour ! Je vais regarder ta progression et ajuster si besoin.',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, coachResponse]);
      }, 1000);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Avatar>
            <AvatarImage src={coach.avatar} />
            <AvatarFallback className="bg-primary text-white">
              {coach.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Discussion avec {coach.name}</h1>
            <p className="text-sm text-muted-foreground">Ton coach personnel</p>
          </div>
        </motion.div>

        {/* Messages */}
        <Card className="card mb-6">
          <CardContent className="p-6 h-96 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="w-10 h-10">
                    {message.role === 'coach' ? (
                      <AvatarImage src={coach.avatar} />
                    ) : (
                      <AvatarFallback className="bg-secondary text-white">
                        {user?.fullName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className={`flex-1 ${message.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                    <div className={`inline-block p-3 rounded-lg max-w-md ${
                      message.role === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-surface text-foreground border border-border'
                    }`}>
                      <p>{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Input */}
        <Card className="card">
          <CardContent className="p-4">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tape ton message..."
                className="flex-1"
              />
              <Button 
                type="submit" 
                className="btn-primary"
                disabled={!inputMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
