import { useLocation } from "wouter";
import { PageWrapper } from "../../components/PageWrapper";
import { Button } from "../../components/ui/button";
import { Users } from "lucide-react";

export default function CoachClientDetail() {
  const [, setLocation] = useLocation();

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Users className="w-16 h-16 mx-auto text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Aucun client pour le moment</h2>
        <p className="text-muted-foreground max-w-md">
          Cette fonctionnalité sera bientôt disponible pour gérer tes clients.
        </p>
        <Button onClick={() => setLocation("/coach/dashboard")} className="mt-4">
          Retour au dashboard
        </Button>
      </div>
    </PageWrapper>
  );
}
