import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageWrapper } from "@/components/PageWrapper";
import { XCircle, ArrowLeft } from "lucide-react";

export default function SubscriptionCancel() {
  const [, setLocation] = useLocation();

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-3xl">Paiement Annulé</CardTitle>
            <CardDescription className="text-lg mt-2">
              Votre paiement n'a pas été finalisé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription className="text-center">
                Aucun montant n'a été débité de votre compte.
                Vous pouvez réessayer à tout moment.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <p className="text-center text-muted-foreground">
                Besoin d'aide ? Contactez notre support ou consultez notre FAQ.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => setLocation("/")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à l'accueil
              </Button>
              <Button
                onClick={() => setLocation("/pricing")}
                className="gap-2"
              >
                Voir les formules
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

