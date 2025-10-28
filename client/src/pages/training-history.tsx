import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, TrendingUp, Target } from 'lucide-react';
import { Link } from 'wouter';

interface TrainingSession {
  week: number;
  completedExercises: string[];
  timestamp: string;
}

export default function TrainingHistory() {
  const [history, setHistory] = useState<TrainingSession[]>([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('trainingHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const calculateProgress = (session: TrainingSession) => {
    // Mock calculation - in real app, this would be based on actual program data
    return Math.floor(Math.random() * 40) + 60; // 60-100%
  };

  const getWeekComparison = (currentWeek: number) => {
    const previousWeek = history.find(s => s.week === currentWeek - 1);
    if (!previousWeek) return null;
    
    const currentSession = history.find(s => s.week === currentWeek);
    if (!currentSession) return null;

    const currentProgress = calculateProgress(currentSession);
    const previousProgress = calculateProgress(previousWeek);
    
    return {
      improvement: currentProgress - previousProgress,
      current: currentProgress,
      previous: previousProgress
    };
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/training">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au programme
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Historique d'entraînement</h1>
            <p className="text-muted-foreground">Suis ta progression semaine par semaine</p>
          </div>

          {history.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Aucun historique</h3>
                <p className="text-muted-foreground mb-4">
                  Commence ton premier programme pour voir ton historique ici.
                </p>
                <Link href="/training">
                  <Button>Commencer un programme</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {history.map((session, index) => {
                const comparison = getWeekComparison(session.week);
                const progress = calculateProgress(session);
                
                return (
                  <Card key={index} className="hover-lift">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Semaine {session.week}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{progress}%</div>
                          <div className="text-sm text-blue-600">Progression</div>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {session.completedExercises.length}
                          </div>
                          <div className="text-sm text-green-600">Exercices terminés</div>
                        </div>
                        
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {new Date(session.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-purple-600">Date</div>
                        </div>
                      </div>

                      {comparison && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="font-medium">Comparaison avec la semaine précédente</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Semaine {session.week - 1}: </span>
                              <span className="font-medium">{comparison.previous}%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Semaine {session.week}: </span>
                              <span className="font-medium">{comparison.current}%</span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className={`font-medium ${comparison.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {comparison.improvement >= 0 ? '+' : ''}{comparison.improvement}% d'amélioration
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Progression Summary */}
          {history.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Résumé de progression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{history.length}</div>
                    <div className="text-sm text-green-600">Semaines complétées</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {history.reduce((sum, session) => sum + session.completedExercises.length, 0)}
                    </div>
                    <div className="text-sm text-blue-600">Total exercices</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(history.reduce((sum, session) => sum + calculateProgress(session), 0) / history.length)}%
                    </div>
                    <div className="text-sm text-purple-600">Progression moyenne</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
