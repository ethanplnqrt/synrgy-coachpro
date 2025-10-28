import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Dumbbell, MessageSquare, Users, Zap, Target, Heart } from "lucide-react";
import { Link } from "wouter";
import { useTheme } from "../components/ThemeProvider";

export default function Landing() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="px-4">
          <div className="max-w-5xl mx-auto text-center py-16">
            <div className="mb-6">
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${theme.colors.primary}20`,
                  color: theme.colors.primary,
                  border: `1px solid ${theme.colors.primary}40`
                }}
              >
                <Zap className="w-4 h-4" />
                Nouveau : Thèmes sportifs dynamiques
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
              CoachPro — Plateforme hybride pour coachs & particuliers
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Que tu sois coach professionnel ou particulier, CoachPro t'accompagne avec l'IA pour 
              créer des programmes d'entraînement et des plans nutritionnels personnalisés.
              <br />
              <span className="font-medium" style={{ color: theme.colors.primary }}>
                {theme.name === 'light' ? '🌞 Mode motivation' : '🌙 Mode focus'}
              </span>
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/demo">
                <Button 
                  size="lg" 
                  className="btn-primary hover-scale"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  Essayer la démo
                </Button>
              </Link>
                  <Link href="/signup">
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover-scale"
                      style={{
                        borderColor: theme.colors.secondary,
                        color: theme.colors.secondary
                      }}
                    >
                      Créer un compte
                    </Button>
                  </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-16" style={{ backgroundColor: theme.colors.surface }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Fonctionnalités qui changent tout
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Une plateforme complète pour révolutionner votre coaching sportif
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{
                icon: Users,
                title: "Gère tes clients",
                desc: "Vue claire de l'avancement et objectifs",
                color: theme.colors.primary
              },{
                icon: Dumbbell,
                title: "Programmes rapides",
                desc: "Plans personnalisés en quelques clics",
                color: theme.colors.secondary
              },{
                icon: MessageSquare,
                title: "Coach IA",
                desc: "Réponses instantanées et pertinentes",
                color: theme.colors.warning
              }].map((f, i) => (
                <Card key={i} className="card-theme hover-scale">
                  <CardContent className="p-6">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${f.color}20` }}
                    >
                      <f.icon className="w-6 h-6" style={{ color: f.color }} />
                    </div>
                    <h3 className="font-semibold mb-2 text-foreground">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="px-4 py-16 bg-background">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Tarifs simples</h2>
            <p className="text-muted-foreground mb-8">Choisis le plan qui correspond à tes besoins</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-theme">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Starter</h3>
                  <div className="text-2xl font-bold mb-2" style={{ color: theme.colors.primary }}>29€/mois</div>
                  <p className="text-sm text-muted-foreground mb-4">Parfait pour débuter</p>
                  <ul className="text-sm space-y-2 mb-6">
                    <li>✓ Jusqu'à 10 clients</li>
                    <li>✓ Programmes illimités</li>
                    <li>✓ Coach IA</li>
                  </ul>
                  <Button className="w-full" style={{ backgroundColor: theme.colors.primary }}>
                    Commencer
                  </Button>
                </CardContent>
              </Card>
              <Card className="card-theme border-2" style={{ borderColor: theme.colors.primary }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Pro</h3>
                    <div 
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ 
                        backgroundColor: theme.colors.warning,
                        color: theme.colors.foreground
                      }}
                    >
                      Populaire
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-2" style={{ color: theme.colors.primary }}>59€/mois</div>
                  <p className="text-sm text-muted-foreground mb-4">Pour les coachs sérieux</p>
                  <ul className="text-sm space-y-2 mb-6">
                    <li>✓ Clients illimités</li>
                    <li>✓ Analytics avancés</li>
                    <li>✓ Support prioritaire</li>
                    <li>✓ Intégrations</li>
                  </ul>
                  <Button className="w-full" style={{ backgroundColor: theme.colors.primary }}>
                    Commencer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section 
          className="px-4 py-16 text-center"
          style={{ 
            background: `linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.secondary}20)`
          }}
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Prêt à révolutionner ton coaching ?
            </h2>
            <p className="text-muted-foreground mb-8">
              Rejoins des centaines de coachs qui utilisent déjà CoachPro
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/demo">
                <Button 
                  size="lg" 
                  className="btn-primary hover-scale"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  Essayer gratuitement
                </Button>
              </Link>
              <Link href="/coach/settings">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="hover-scale"
                  style={{ 
                    borderColor: theme.colors.secondary,
                    color: theme.colors.secondary
                  }}
                >
                  Voir les thèmes
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-8 border-t" style={{ borderColor: theme.colors.muted }}>
          <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
            <p>© 2024 CoachPro. Tous droits réservés.</p>
            <div className="mt-2 flex items-center justify-center gap-4">
              <Link href="#" className="hover:underline">Mentions légales</Link>
              <Link href="#" className="hover:underline">Politique de confidentialité</Link>
              <Link href="#" className="hover:underline">Contact</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}