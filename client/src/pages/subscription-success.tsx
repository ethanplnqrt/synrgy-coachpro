import { useEffect } from "react";
import { useLocation } from "wouter";
import { PageWrapper } from "@/components/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function SubscriptionSuccess() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      const dashboardPath = 
        user?.role === "coach" ? "/coach/dashboard" :
        user?.role === "client" ? "/client/dashboard" :
        "/athlete/dashboard";
      setLocation(dashboardPath);
    }, 5000);

    return () => clearTimeout(timer);
  }, [user, setLocation]);

  const handleGoToDashboard = () => {
    const dashboardPath = 
      user?.role === "coach" ? "/coach/dashboard" :
      user?.role === "client" ? "/client/dashboard" :
      "/athlete/dashboard";
    setLocation(dashboardPath);
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-12 pb-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
              >
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>

              <h1 className="text-3xl font-bold mb-3">
                Paiement réussi !
              </h1>
              
              <p className="text-muted-foreground mb-6">
                Votre abonnement Synrgy est maintenant actif. 
                Bienvenue dans la communauté !
              </p>

              <div className="bg-white rounded-lg p-4 mb-6 border border-green-200">
                <p className="text-sm font-medium mb-2">Prochaines étapes :</p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Accédez à votre tableau de bord personnalisé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Explorez toutes les fonctionnalités premium</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Commencez à progresser avec l'IA Synrgy</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleGoToDashboard}
                size="lg"
                className="w-full"
              >
                Accéder au tableau de bord
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-xs text-muted-foreground mt-4">
                Redirection automatique dans 5 secondes...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

