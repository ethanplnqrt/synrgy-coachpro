import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Trophy, Target, Zap, Star, Award, Calendar, CheckCircle, Clock, Loader2, AlertCircle } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { useAppConfig } from "../lib/config";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly";
  difficulty: "easy" | "medium" | "hard";
  target: number;
  current: number;
  unit: string;
  reward: string;
  completed: boolean;
  deadline: Date;
  category: "fitness" | "nutrition" | "wellness" | "social";
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  earned: boolean;
  earnedAt?: Date;
}

export default function ChallengesPage() {
  const [, setLocation] = useLocation();
  const { data: config } = useAppConfig();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("challenges");
  const [showConfetti, setShowConfetti] = useState(false);

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedChallenges = localStorage.getItem('synrgy-challenges');
    const savedBadges = localStorage.getItem('synrgy-badges');
    const savedAchievements = localStorage.getItem('synrgy-achievements');
    const savedLevel = localStorage.getItem('synrgy-user-level');
    const savedXP = localStorage.getItem('synrgy-user-xp');
    
    if (savedChallenges) {
      try {
        setChallenges(JSON.parse(savedChallenges));
      } catch (e) {
        console.error('Erreur lors du chargement des défis:', e);
      }
    }
    
    if (savedBadges) {
      try {
        setBadges(JSON.parse(savedBadges));
      } catch (e) {
        console.error('Erreur lors du chargement des badges:', e);
      }
    }
    
    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements));
      } catch (e) {
        console.error('Erreur lors du chargement des succès:', e);
      }
    }
    
    if (savedLevel) setUserLevel(parseInt(savedLevel));
    if (savedXP) setUserXP(parseInt(savedXP));
  }, []);

  // Sauvegarder les données
  const saveChallenges = (challenges: Challenge[]) => {
    setChallenges(challenges);
    localStorage.setItem('synrgy-challenges', JSON.stringify(challenges));
  };

  const saveBadges = (badges: Badge[]) => {
    setBadges(badges);
    localStorage.setItem('synrgy-badges', JSON.stringify(badges));
  };

  const saveAchievements = (achievements: Achievement[]) => {
    setAchievements(achievements);
    localStorage.setItem('synrgy-achievements', JSON.stringify(achievements));
  };

  const saveLevel = (level: number, xp: number) => {
    setUserLevel(level);
    setUserXP(xp);
    localStorage.setItem('synrgy-user-level', level.toString());
    localStorage.setItem('synrgy-user-xp', xp.toString());
  };

  const loadChallenges = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/challenges/get');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }

      const result = await response.json();
      saveChallenges(result);
    } catch (err) {
      setError('Erreur lors du chargement des défis');
    } finally {
      setIsLoading(false);
    }
  };

  const updateChallengeProgress = async (challengeId: string, progress: number) => {
    try {
      const response = await fetch('/api/challenges/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, progress })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      const result = await response.json();
      saveChallenges(result.challenges);
      
      if (result.levelUp) {
        saveLevel(result.level, result.xp);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const mockLoadChallenges = () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const mockChallenges: Challenge[] = [
        {
          id: "1",
          title: "7 jours actifs",
          description: "Faites au moins 10,000 pas pendant 7 jours consécutifs",
          type: "weekly",
          difficulty: "medium",
          target: 7,
          current: 3,
          unit: "jours",
          reward: "Badge Marathonien",
          completed: false,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          category: "fitness"
        },
        {
          id: "2",
          title: "Hydratation parfaite",
          description: "Buvez 2L d'eau par jour pendant 5 jours",
          type: "weekly",
          difficulty: "easy",
          target: 5,
          current: 5,
          unit: "jours",
          reward: "Badge Hydratation",
          completed: true,
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          category: "wellness"
        },
        {
          id: "3",
          title: "Force +10%",
          description: "Augmentez votre charge d'entraînement de 10% cette semaine",
          type: "weekly",
          difficulty: "hard",
          target: 10,
          current: 7,
          unit: "%",
          reward: "Badge Powerlifter",
          completed: false,
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          category: "fitness"
        },
        {
          id: "4",
          title: "Nutrition équilibrée",
          description: "Mangez 5 portions de fruits/légumes par jour pendant 7 jours",
          type: "weekly",
          difficulty: "medium",
          target: 7,
          current: 2,
          unit: "jours",
          reward: "Badge Nutritionniste",
          completed: false,
          deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          category: "nutrition"
        },
        {
          id: "5",
          title: "Défi social",
          description: "Partagez 3 posts sur la communauté cette semaine",
          type: "weekly",
          difficulty: "easy",
          target: 3,
          current: 1,
          unit: "posts",
          reward: "Badge Social",
          completed: false,
          deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          category: "social"
        }
      ];

      const mockBadges: Badge[] = [
        {
          id: "1",
          name: "Premier Pas",
          description: "Complétez votre premier défi",
          icon: "👟",
          earned: true,
          earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          rarity: "common"
        },
        {
          id: "2",
          name: "Hydratation",
          description: "Buvez 2L d'eau pendant 5 jours",
          icon: "💧",
          earned: true,
          earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          rarity: "common"
        },
        {
          id: "3",
          name: "Marathonien",
          description: "10,000 pas pendant 7 jours",
          icon: "🏃",
          earned: false,
          rarity: "rare"
        },
        {
          id: "4",
          name: "Powerlifter",
          description: "Augmentez votre charge de 10%",
          icon: "💪",
          earned: false,
          rarity: "epic"
        },
        {
          id: "5",
          name: "Légende",
          description: "Complétez 50 défis",
          icon: "👑",
          earned: false,
          rarity: "legendary"
        }
      ];

      const mockAchievements: Achievement[] = [
        {
          id: "1",
          title: "Débutant",
          description: "Complétez votre premier défi",
          points: 100,
          earned: true,
          earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: "2",
          title: "Hydratation Master",
          description: "Buvez 2L d'eau pendant 5 jours",
          points: 150,
          earned: true,
          earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: "3",
          title: "Athlète",
          description: "Complétez 10 défis fitness",
          points: 500,
          earned: false
        },
        {
          id: "4",
          title: "Nutritionniste",
          description: "Complétez 5 défis nutrition",
          points: 300,
          earned: false
        }
      ];

      saveChallenges(mockChallenges);
      saveBadges(mockBadges);
      saveAchievements(mockAchievements);
      setIsLoading(false);
    }, 1500);
  };

  const mockUpdateProgress = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const newProgress = Math.min(challenge.current + 1, challenge.target);
    const updatedChallenges = challenges.map(c => 
      c.id === challengeId 
        ? { ...c, current: newProgress, completed: newProgress >= c.target }
        : c
    );

    saveChallenges(updatedChallenges);

    // Simuler gain d'XP
    const xpGain = 50;
    const newXP = userXP + xpGain;
    const newLevel = Math.floor(newXP / 1000) + 1;
    
    if (newLevel > userLevel) {
      saveLevel(newLevel, newXP);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      saveLevel(userLevel, newXP);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fitness": return "💪";
      case "nutrition": return "🍎";
      case "wellness": return "🧘";
      case "social": return "👥";
      default: return "🎯";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800";
      case "rare": return "bg-blue-100 text-blue-800";
      case "epic": return "bg-purple-100 text-purple-800";
      case "legendary": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const nextLevelXP = userLevel * 1000;
  const progressToNextLevel = (userXP % 1000) / 1000 * 100;

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header avec niveau */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🏆 Défis & Gamification
          </h1>
          <p className="text-muted-foreground mb-4">
            Relevez des défis, gagnez des badges et montez de niveau !
          </p>
          
          {/* Barre de niveau */}
          <Card className="max-w-md mx-auto">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">Niveau {userLevel}</span>
                </div>
                <span className="text-sm text-muted-foreground">{userXP} XP</span>
              </div>
              <Progress value={progressToNextLevel} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {userXP % 1000} / 1000 XP vers le niveau {userLevel + 1}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Confettis */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-6xl animate-bounce">🎉</div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="challenges">Défis</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="achievements">Succès</TabsTrigger>
          </TabsList>

          {/* Tab Défis */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Défis actifs</h2>
              <div className="flex gap-2">
                {config?.testMode && (
                  <Button onClick={mockLoadChallenges} variant="secondary" size="sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Charger démo
                  </Button>
                )}
                <Button onClick={loadChallenges} variant="outline" size="sm" disabled={isLoading}>
                  <Target className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
              </div>
            </div>

            {isLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Chargement des défis...</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} className={`${challenge.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="text-xl">{getCategoryIcon(challenge.category)}</span>
                          {challenge.title}
                        </span>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progression</span>
                          <span>{challenge.current} / {challenge.target} {challenge.unit}</span>
                        </div>
                        <Progress value={(challenge.current / challenge.target) * 100} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>Échéance: {challenge.deadline.toLocaleDateString()}</span>
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            Récompense: {challenge.reward}
                          </div>
                        </div>
                        
                        {challenge.completed ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Terminé !</span>
                          </div>
                        ) : (
                          <Button 
                            onClick={() => config?.testMode ? mockUpdateProgress(challenge.id) : updateChallengeProgress(challenge.id, challenge.current + 1)}
                            size="sm"
                          >
                            +1 {challenge.unit}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {challenges.length === 0 && !isLoading && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Aucun défi disponible</h3>
                  <p className="text-muted-foreground mb-4">
                    Revenez plus tard pour de nouveaux défis !
                  </p>
                  {config?.testMode && (
                    <Button onClick={mockLoadChallenges}>
                      Charger des défis de démonstration
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab Badges */}
          <TabsContent value="badges" className="space-y-6">
            <h2 className="text-xl font-semibold">Mes badges</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <Card key={badge.id} className={`${badge.earned ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 opacity-60'}`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <h3 className="font-semibold mb-1">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                    
                    <Badge className={getRarityColor(badge.rarity)}>
                      {badge.rarity}
                    </Badge>
                    
                    {badge.earned && badge.earnedAt && (
                      <div className="text-xs text-green-600 mt-2">
                        Obtenu le {badge.earnedAt.toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Succès */}
          <TabsContent value="achievements" className="space-y-6">
            <h2 className="text-xl font-semibold">Succès</h2>
            
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`${achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {achievement.earned ? '🏆' : '🎯'}
                        </div>
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          {achievement.earned && achievement.earnedAt && (
                            <p className="text-xs text-green-600 mt-1">
                              Obtenu le {achievement.earnedAt.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">+{achievement.points}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

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
          <Button onClick={() => setLocation('/health-trackers')} variant="outline">
            Trackers santé
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

