import React from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function ChatIA() {
  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/client/dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au dashboard
            </Button>
          </Link>
        </div>
        
        <Card className="text-center">
          <CardHeader>
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-primary" />
            <CardTitle className="text-2xl">Coach IA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Chattez avec votre coach IA personnel !
              <br />
              Obtenez des conseils personnalisés pour vos entraînements.
            </p>
            <div className="space-y-2">
              <Button onClick={() => alert("Chat IA démo - à venir 🤖")}>
                Commencer la conversation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
