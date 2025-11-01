import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Upload, Palette, Save, Eye, Loader2, AlertCircle, CheckCircle, Download } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { useAppConfig } from "../lib/config";

interface BrandingSettings {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  companyName: string;
  tagline: string;
  customCSS?: string;
}

interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
}

export default function BrandingPage() {
  const [, setLocation] = useLocation();
  const { data: config } = useAppConfig();
  const [branding, setBranding] = useState<BrandingSettings>({
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    fontFamily: "Inter",
    companyName: "Synrgy",
    tagline: "Hybrid Energy"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("colors");
  const [previewMode, setPreviewMode] = useState(false);

  // Presets de couleurs
  const colorPresets: ColorPreset[] = [
    { name: "Synrgy Original", primary: "#3B82F6", secondary: "#10B981" },
    { name: "Orange Energy", primary: "#F97316", secondary: "#4ADE80" },
    { name: "Purple Power", primary: "#8B5CF6", secondary: "#06B6D4" },
    { name: "Red Passion", primary: "#EF4444", secondary: "#F59E0B" },
    { name: "Green Nature", primary: "#22C55E", secondary: "#84CC16" },
    { name: "Blue Ocean", primary: "#0EA5E9", secondary: "#3B82F6" }
  ];

  // Charger les paramètres depuis localStorage
  useEffect(() => {
    const savedBranding = localStorage.getItem('synrgy-branding');
    
    if (savedBranding) {
      try {
        setBranding(JSON.parse(savedBranding));
      } catch (e) {
        console.error('Erreur lors du chargement du branding:', e);
      }
    }
  }, []);

  // Sauvegarder les paramètres
  const saveBranding = (newBranding: BrandingSettings) => {
    setBranding(newBranding);
    localStorage.setItem('synrgy-branding', JSON.stringify(newBranding));
  };

  // Sauvegarder sur l'API
  const saveToAPI = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/branding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branding)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      setSuccess('Branding sauvegardé avec succès !');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erreur lors de la sauvegarde du branding');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock save pour le mode démo
  const mockSave = () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    setTimeout(() => {
      setSuccess('Branding sauvegardé avec succès ! (Mode démo)');
      setTimeout(() => setSuccess(null), 3000);
      setIsLoading(false);
    }, 1500);
  };

  // Appliquer un preset de couleurs
  const applyPreset = (preset: ColorPreset) => {
    const newBranding = {
      ...branding,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    };
    saveBranding(newBranding);
  };

  // Gérer l'upload de logo
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoData = e.target?.result as string;
        const newBranding = { ...branding, logo: logoData };
        saveBranding(newBranding);
      };
      reader.readAsDataURL(file);
    }
  };

  // Appliquer le branding en temps réel
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', branding.primaryColor);
    root.style.setProperty('--brand-secondary', branding.secondaryColor);
    root.style.setProperty('--brand-font', branding.fontFamily);
  }, [branding]);

  // Exporter le branding
  const exportBranding = () => {
    const blob = new Blob([JSON.stringify(branding, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'synrgy-branding.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🎨 Personnalisation & Marque Blanche
          </h1>
          <p className="text-muted-foreground">
            Personnalisez l'apparence de votre plateforme Synrgy
          </p>
        </div>

        {/* Contrôles */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setPreviewMode(!previewMode)}
                  variant={previewMode ? "default" : "outline"}
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? 'Masquer' : 'Aperçu'}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={exportBranding} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                {config?.testMode ? (
                  <Button onClick={mockSave} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Sauvegarder (Démo)
                  </Button>
                ) : (
                  <Button onClick={saveToAPI} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Sauvegarder
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors">Couleurs</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
            <TabsTrigger value="typography">Typographie</TabsTrigger>
            <TabsTrigger value="advanced">Avancé</TabsTrigger>
          </TabsList>

          {/* Tab Couleurs */}
          <TabsContent value="colors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Presets de couleurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {colorPresets.map((preset) => (
                    <Card 
                      key={preset.name} 
                      className="cursor-pointer hover-lift"
                      onClick={() => applyPreset(preset)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: preset.secondary }}
                          />
                        </div>
                        <h3 className="font-medium text-sm">{preset.name}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Couleurs personnalisées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Couleur primaire</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={branding.primaryColor}
                        onChange={(e) => saveBranding({...branding, primaryColor: e.target.value})}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={branding.primaryColor}
                        onChange={(e) => saveBranding({...branding, primaryColor: e.target.value})}
                        placeholder="#3B82F6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={branding.secondaryColor}
                        onChange={(e) => saveBranding({...branding, secondaryColor: e.target.value})}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={branding.secondaryColor}
                        onChange={(e) => saveBranding({...branding, secondaryColor: e.target.value})}
                        placeholder="#10B981"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Logo */}
          <TabsContent value="logo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Logo de l'entreprise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    {branding.logo ? (
                      <img 
                        src={branding.logo} 
                        alt="Logo" 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="logoUpload">Choisir un fichier</Label>
                    <Input
                      id="logoUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Formats acceptés: PNG, JPG, SVG (max 2MB)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Nom de l'entreprise</Label>
                    <Input
                      id="companyName"
                      value={branding.companyName}
                      onChange={(e) => saveBranding({...branding, companyName: e.target.value})}
                      placeholder="Synrgy"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Slogan</Label>
                    <Input
                      id="tagline"
                      value={branding.tagline}
                      onChange={(e) => saveBranding({...branding, tagline: e.target.value})}
                      placeholder="Hybrid Energy"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Typographie */}
          <TabsContent value="typography" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de typographie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fontFamily">Police de caractères</Label>
                  <select
                    id="fontFamily"
                    value={branding.fontFamily}
                    onChange={(e) => saveBranding({...branding, fontFamily: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md mt-1"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>

                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-2">Aperçu de la typographie</h3>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Titre principal</h1>
                    <h2 className="text-2xl font-semibold">Titre secondaire</h2>
                    <h3 className="text-xl font-medium">Sous-titre</h3>
                    <p className="text-base">Texte normal - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className="text-sm text-muted-foreground">Texte secondaire - Sed do eiusmod tempor incididunt.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Avancé */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CSS personnalisé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customCSS">CSS personnalisé</Label>
                  <textarea
                    id="customCSS"
                    value={branding.customCSS || ''}
                    onChange={(e) => saveBranding({...branding, customCSS: e.target.value})}
                    placeholder="/* Votre CSS personnalisé ici */"
                    className="w-full h-32 px-3 py-2 border border-input rounded-md mt-1 font-mono text-sm"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Ajoutez du CSS personnalisé pour personnaliser davantage l'apparence
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Aperçu en temps réel */}
        {previewMode && (
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Aperçu en temps réel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {branding.logo && (
                    <img src={branding.logo} alt="Logo" className="h-8" />
                  )}
                  <div>
                    <h1 className="text-xl font-bold">{branding.companyName}</h1>
                    <p className="text-sm text-muted-foreground">{branding.tagline}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    style={{ 
                      backgroundColor: branding.primaryColor,
                      color: 'white'
                    }}
                  >
                    Bouton primaire
                  </Button>
                  <Button 
                    variant="outline"
                    style={{ 
                      borderColor: branding.secondaryColor,
                      color: branding.secondaryColor
                    }}
                  >
                    Bouton secondaire
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages de statut */}
        {success && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{success}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => setLocation('/coach/dashboard')} variant="outline">
            Retour au dashboard
          </Button>
          <Button onClick={() => setLocation('/coach/analytics')} variant="outline">
            Analytics
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}




