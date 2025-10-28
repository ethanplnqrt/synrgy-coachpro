import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useTheme } from '../components/ThemeProvider';
import { Sun, Moon, Palette, Settings as SettingsIcon, User, Bell, Shield } from 'lucide-react';

export default function Settings() {
  const { themeName, toggleTheme, theme } = useTheme();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
            <p className="text-muted-foreground">Personnalisez votre expérience CoachPro</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Apparence */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Apparence
              </CardTitle>
              <CardDescription>
                Choisissez le thème qui vous motive le plus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sélecteur de thème */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="theme-toggle" className="text-base font-medium">
                    Mode {themeName === 'light' ? 'clair' : 'sombre'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {themeName === 'light' 
                      ? '🌞 Thème motivation et bien-être' 
                      : '🌙 Thème focus et énergie'
                    }
                  </p>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={themeName === 'dark'}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <Separator />

              {/* Aperçu des thèmes */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Aperçu des thèmes</Label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Thème clair */}
                  <div className={`p-3 rounded-lg border-2 transition-all ${
                    themeName === 'light' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-card'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Clair</span>
                      {themeName === 'light' && (
                        <Badge variant="secondary" className="text-xs">Actif</Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-orange-500 rounded"></div>
                      <div className="h-2 bg-green-400 rounded w-3/4"></div>
                      <div className="h-2 bg-yellow-400 rounded w-1/2"></div>
                    </div>
                  </div>

                  {/* Thème sombre */}
                  <div className={`p-3 rounded-lg border-2 transition-all ${
                    themeName === 'dark' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-card'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Moon className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Sombre</span>
                      {themeName === 'dark' && (
                        <Badge variant="secondary" className="text-xs">Actif</Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-purple-500 rounded"></div>
                      <div className="h-2 bg-blue-500 rounded w-3/4"></div>
                      <div className="h-2 bg-green-500 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profil */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profil
              </CardTitle>
              <CardDescription>
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Nom d'utilisateur</Label>
                <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  coach.demo@coachpro.com
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Rôle</Label>
                <Badge variant="secondary" className="text-sm">
                  Coach Sportif Certifié
                </Badge>
              </div>
              <Button variant="outline" className="w-full">
                Modifier le profil
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configurez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Messages clients</Label>
                  <p className="text-xs text-muted-foreground">
                    Recevoir les nouveaux messages
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Rappels d'entraînement</Label>
                  <p className="text-xs text-muted-foreground">
                    Notifications pour les séances
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Conseils IA</Label>
                  <p className="text-xs text-muted-foreground">
                    Suggestions personnalisées
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Protégez votre compte et vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Mot de passe</Label>
                <p className="text-xs text-muted-foreground">
                  Dernière modification il y a 30 jours
                </p>
              </div>
              <Button variant="outline" className="w-full">
                Changer le mot de passe
              </Button>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Sessions actives</Label>
                <p className="text-xs text-muted-foreground">
                  2 appareils connectés
                </p>
              </div>
              <Button variant="outline" className="w-full">
                Gérer les sessions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Informations sur le thème actuel */}
        <Card className="border-border bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: theme.colors.primary }}
              ></div>
              <div>
                <h3 className="font-medium text-foreground">
                  Thème {themeName === 'light' ? 'Clair' : 'Sombre'} actif
                </h3>
                <p className="text-sm text-muted-foreground">
                  {themeName === 'light' 
                    ? 'Mode motivation et bien-être - Orange vif et vert clair pour dynamiser vos séances'
                    : 'Mode focus et énergie - Violet énergique et bleu profond pour concentrer votre attention'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
