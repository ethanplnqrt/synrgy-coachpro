import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { BookOpen, Play, Headphones, Star, Download, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { useAppConfig } from "../lib/config";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "article" | "video" | "podcast";
  category: "nutrition" | "fitness" | "wellness" | "business";
  duration?: number;
  url?: string;
  premium: boolean;
  rating: number;
  views: number;
  publishedAt: Date;
  author: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export default function ResourcesPage() {
  const [, setLocation] = useLocation();
  const { data: config } = useAppConfig();
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedResources = localStorage.getItem('synrgy-resources');
    const savedCategories = localStorage.getItem('synrgy-resource-categories');
    
    if (savedResources) {
      try {
        setResources(JSON.parse(savedResources));
      } catch (e) {
        console.error('Erreur lors du chargement des ressources:', e);
      }
    }
    
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (e) {
        console.error('Erreur lors du chargement des catégories:', e);
      }
    }
  }, []);

  // Sauvegarder les ressources
  const saveResources = (resources: Resource[]) => {
    setResources(resources);
    localStorage.setItem('synrgy-resources', JSON.stringify(resources));
  };

  // Charger les ressources depuis l'API
  const loadResources = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/resources');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }

      const result = await response.json();
      saveResources(result);
    } catch (err) {
      setError('Erreur lors du chargement des ressources');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data pour le mode démo
  const mockLoadResources = () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const mockResources: Resource[] = [
        {
          id: "1",
          title: "Guide complet de la nutrition sportive",
          description: "Apprenez les bases de la nutrition pour optimiser vos performances sportives et votre récupération.",
          type: "article",
          category: "nutrition",
          duration: 15,
          premium: false,
          rating: 4.8,
          views: 1250,
          publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          author: "Dr. Sarah Martin"
        },
        {
          id: "2",
          title: "HIIT pour débutants - Vidéo complète",
          description: "Séance d'entraînement HIIT de 30 minutes adaptée aux débutants avec explications détaillées.",
          type: "video",
          category: "fitness",
          duration: 30,
          url: "https://youtube.com/watch?v=demo",
          premium: true,
          rating: 4.9,
          views: 3200,
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          author: "Coach Mike Johnson"
        },
        {
          id: "3",
          title: "Podcast: Mental et performance",
          description: "Comment développer la force mentale nécessaire pour atteindre vos objectifs sportifs.",
          type: "podcast",
          category: "wellness",
          duration: 45,
          url: "https://spotify.com/episode/demo",
          premium: false,
          rating: 4.7,
          views: 890,
          publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          author: "Dr. Emma Wilson"
        },
        {
          id: "4",
          title: "Construire son business de coaching",
          description: "Stratégies éprouvées pour développer et faire croître votre activité de coaching personnel.",
          type: "article",
          category: "business",
          duration: 20,
          premium: true,
          rating: 4.6,
          views: 2100,
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          author: "Alex Thompson"
        },
        {
          id: "5",
          title: "Yoga pour la récupération",
          description: "Séquence de yoga douce pour améliorer la récupération après l'entraînement.",
          type: "video",
          category: "wellness",
          duration: 25,
          url: "https://youtube.com/watch?v=yoga-demo",
          premium: false,
          rating: 4.8,
          views: 1800,
          publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          author: "Instructor Lisa"
        }
      ];

      const mockCategories: Category[] = [
        { id: "nutrition", name: "Nutrition", icon: "🍎", count: 12 },
        { id: "fitness", name: "Fitness", icon: "💪", count: 18 },
        { id: "wellness", name: "Bien-être", icon: "🧘", count: 8 },
        { id: "business", name: "Business", icon: "💼", count: 6 }
      ];

      saveResources(mockResources);
      setCategories(mockCategories);
      setIsLoading(false);
    }, 1500);
  };

  // Obtenir l'icône selon le type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article": return <BookOpen className="w-4 h-4" />;
      case "video": return <Play className="w-4 h-4" />;
      case "podcast": return <Headphones className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  // Obtenir la couleur selon le type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "article": return "bg-blue-100 text-blue-800";
      case "video": return "bg-red-100 text-red-800";
      case "podcast": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Obtenir la couleur selon la catégorie
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "nutrition": return "bg-green-100 text-green-800";
      case "fitness": return "bg-orange-100 text-orange-800";
      case "wellness": return "bg-purple-100 text-purple-800";
      case "business": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Filtrer les ressources
  const filteredResources = resources.filter(resource => {
    if (selectedCategory !== "all" && resource.category !== selectedCategory) {
      return false;
    }
    if (activeTab === "premium" && !resource.premium) {
      return false;
    }
    if (activeTab === "free" && resource.premium) {
      return false;
    }
    return true;
  });

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            📚 Ressources Premium
          </h1>
          <p className="text-muted-foreground">
            Articles, vidéos et podcasts pour développer vos connaissances
          </p>
        </div>

        {/* Contrôles */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {filteredResources.length} ressource{filteredResources.length > 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="flex gap-2">
                {config?.testMode && (
                  <Button onClick={mockLoadResources} variant="secondary" size="sm">
                    <Star className="w-4 h-4 mr-2" />
                    Charger démo
                  </Button>
                )}
                <Button onClick={loadResources} variant="outline" size="sm" disabled={isLoading}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="free">Gratuites</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Catégories */}
            <Card>
              <CardHeader>
                <CardTitle>Catégories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setSelectedCategory("all")}
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                  >
                    Toutes ({resources.length})
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.name} ({category.count})
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Liste des ressources */}
            {isLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Chargement des ressources...</p>
                </CardContent>
              </Card>
            ) : filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="hover-lift">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(resource.type)}
                          <span className="text-lg">{resource.title}</span>
                        </div>
                        {resource.premium && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Badge className={getTypeColor(resource.type)}>
                            {resource.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge className={getCategoryColor(resource.category)}>
                            {resource.category}
                          </Badge>
                        </div>
                        {resource.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {resource.duration} min
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {resource.rating}
                          </div>
                          <div className="text-muted-foreground">
                            {resource.views} vues
                          </div>
                        </div>
                        <div className="text-muted-foreground">
                          {resource.author}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {resource.url ? (
                          <Button size="sm" className="flex-1">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Ouvrir
                          </Button>
                        ) : (
                          <Button size="sm" className="flex-1">
                            <BookOpen className="w-3 h-3 mr-1" />
                            Lire
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Aucune ressource</h3>
                  <p className="text-muted-foreground mb-4">
                    Aucune ressource trouvée pour cette catégorie
                  </p>
                  {config?.testMode && (
                    <Button onClick={mockLoadResources}>
                      Charger des ressources de démonstration
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Statistiques */}
        {resources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{resources.length}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {resources.filter(r => !r.premium).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Gratuites</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {resources.filter(r => r.premium).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Premium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(resources.reduce((acc, r) => acc + r.rating, 0) / resources.length * 10) / 10}
                  </div>
                  <div className="text-sm text-muted-foreground">Note moyenne</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Erreur */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2 text-destructive">Erreur</h3>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => setLocation('/coach/dashboard')} variant="outline">
            Retour au dashboard
          </Button>
          <Button onClick={() => setLocation('/pricing')} variant="outline">
            Voir les offres
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

