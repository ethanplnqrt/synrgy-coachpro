import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Brain, TrendingUp, Users, Zap, Heart, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Brain,
      title: "Coach IA Personnalisé",
      description: "Un assistant intelligent qui comprend ton profil et s'adapte à ta progression",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Suivi de Performance",
      description: "Analytics en temps réel de tes entraînements, nutrition et progression",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Gestion de Clients",
      description: "Pour les coachs : gérez vos athlètes, programmes et communications",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: Zap,
      title: "Programmes Adaptatifs",
      description: "Plans d'entraînement et nutrition qui évoluent avec tes résultats",
      gradient: "from-yellow-500 to-orange-500"
    },
  ];

  const benefits = [
    "Authentification sécurisée avec JWT",
    "Chat IA illimité avec contexte",
    "Historique complet de tes sessions",
    "Interface moderne et responsive",
    "3 profils adaptés : Coach, Client, Athlète",
    "Données privées et sécurisées"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge className="mb-6 text-lg px-6 py-2" variant="secondary">
              <Zap className="w-4 h-4 mr-2" />
              Plateforme de coaching nouvelle génération
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Synrgy
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Ton coach IA personnel pour une progression optimale
            </p>
            
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Que tu sois coach professionnel, client accompagné ou athlète indépendant,
              Synrgy s'adapte à ton profil avec une IA intelligente et empathique.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                onClick={() => setLocation("/pricing")}
              >
                Découvrir les formules
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() => setLocation("/login")}
              >
                Se connecter
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Pourquoi choisir Synrgy ?</h2>
            <p className="text-xl text-muted-foreground">
              Une plateforme complète pour transformer ta passion en résultats
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Tout ce dont tu as besoin</h2>
            <p className="text-xl text-muted-foreground">
              Une plateforme complète pour coaches et athlètes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-background"
              >
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6">
              Prêt à transformer ta progression ?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Rejoins Synrgy et découvre une nouvelle façon de t'entraîner avec l'IA
            </p>
            
            <Button
              size="lg"
              className="text-xl px-12 py-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={() => setLocation("/pricing")}
            >
              <Dumbbell className="mr-3 w-6 h-6" />
              Commencer maintenant
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            Synrgy - Hybrid Energy
          </p>
          <p className="mt-2 text-sm">
            Intelligence artificielle au service de ta performance
          </p>
        </div>
      </footer>
    </div>
  );
}

