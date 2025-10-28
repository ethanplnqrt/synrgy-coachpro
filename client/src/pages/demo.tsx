import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "wouter";
import { Users, Dumbbell, Utensils, MessageSquare } from "lucide-react";

export default function Demo() {
  return (
    <div className="min-h-screen bg-background">
      <Header demoBanner />
      <main className="pt-20 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center py-8">
            <h1 className="text-4xl font-bold mb-4">Mode Démo Synrgy</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explorez librement Synrgy en tant que coach professionnel ou athlète. 
              Paiement et authentification sont désactivés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coach Demo */}
            <Card className="border-orange-200 bg-orange-50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Users className="w-6 h-6" />
                  Tester en tant que Coach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-600 mb-4">
                  Accès aux outils de gestion pour coachs : programmes IA, nutrition, suivi d'athlètes.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Dumbbell className="w-4 h-4 text-orange-500" />
                    <span>Création de programmes IA</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Utensils className="w-4 h-4 text-orange-500" />
                    <span>Plans nutritionnels personnalisés</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span>Gestion d'athlètes</span>
                  </div>
                </div>
                <Link href="/coach/dashboard">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Accéder au dashboard Coach
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Athlete Demo */}
            <Card className="border-blue-200 bg-blue-50 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Dumbbell className="w-6 h-6" />
                  Tester en tant qu'Athlète
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-600 mb-4">
                  Accès à l'espace personnel : suivi de programme, nutrition, coach IA intégré.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Dumbbell className="w-4 h-4 text-blue-500" />
                    <span>Programme d'entraînement personnel</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Utensils className="w-4 h-4 text-blue-500" />
                    <span>Plan nutritionnel adapté</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span>Coach IA personnel</span>
                  </div>
                </div>
                <Link href="/athlete/dashboard">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Accéder au dashboard Athlète
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Features Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Fonctionnalités disponibles en démo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <Dumbbell className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-medium mb-1">Programmes IA</h3>
                  <p className="text-sm text-muted-foreground">Génération automatique de programmes d'entraînement</p>
                </div>
                <div className="text-center p-4">
                  <Utensils className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <h3 className="font-medium mb-1">Nutrition IA</h3>
                  <p className="text-sm text-muted-foreground">Plans alimentaires personnalisés avec ajustements</p>
                </div>
                <div className="text-center p-4">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-medium mb-1">Coach IA</h3>
                  <p className="text-sm text-muted-foreground">Assistant intelligent pour conseils et motivation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}