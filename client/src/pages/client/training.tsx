/**
 * 🏋️ CLIENT TRAINING PAGE
 * 
 * Hevy-style workout logger.
 * - View program
 * - Log sets/reps/weight
 * - Track progress
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Plus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ClientTraining() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [program, setProgram] = useState<any>(null);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [sessionEntries, setSessionEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgram();
  }, []);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/programs/${user?.id}`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setProgram(data);
      }
    } catch (error) {
      console.error('Error fetching program:', error);
    } finally {
      setLoading(false);
    }
  };

  const startWorkout = (block: any) => {
    setActiveSession(block);
    // Initialize entries from program
    const entries = block.exercises.map((ex: any) => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      performedSets: ex.sets.map((s: any) => ({ ...s, completed: false })),
    }));
    setSessionEntries(entries);
  };

  const updateSet = (entryIdx: number, setIdx: number, field: string, value: any) => {
    const updated = [...sessionEntries];
    updated[entryIdx].performedSets[setIdx][field] = value;
    setSessionEntries(updated);
  };

  const toggleSetComplete = (entryIdx: number, setIdx: number) => {
    const updated = [...sessionEntries];
    updated[entryIdx].performedSets[setIdx].completed =
      !updated[entryIdx].performedSets[setIdx].completed;
    setSessionEntries(updated);
  };

  const finishWorkout = async () => {
    try {
      const res = await fetch('/api/sessions/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          programId: program.id,
          entries: sessionEntries,
          notes: '',
        }),
      });

      if (res.ok) {
        toast({
          title: 'Séance enregistrée !',
          description: 'Félicitations pour ton travail 💪',
        });
        setActiveSession(null);
        setSessionEntries([]);
      }
    } catch (error) {
      console.error('Error logging session:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer la séance',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Aucun programme actif</h2>
            <p className="text-muted-foreground">
              Ton coach n'a pas encore créé de programme pour toi.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If workout is active
  if (activeSession) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">{activeSession.name}</h1>
            <p className="text-muted-foreground">En cours...</p>
          </div>
          <Badge variant="default">Active</Badge>
        </div>

        <div className="space-y-6">
          {sessionEntries.map((entry, entryIdx) => (
            <Card key={entryIdx}>
              <CardHeader>
                <CardTitle className="text-lg">{entry.exerciseName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entry.performedSets.map((set: any, setIdx: number) => (
                    <div
                      key={setIdx}
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        set.completed ? 'bg-primary/10' : 'bg-accent'
                      }`}
                    >
                      <div className="text-sm font-medium w-12">
                        Série {setIdx + 1}
                      </div>
                      <Input
                        type="number"
                        placeholder="Reps"
                        value={set.reps || ''}
                        onChange={(e) => updateSet(entryIdx, setIdx, 'reps', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                      <Input
                        type="number"
                        placeholder="Poids (kg)"
                        value={set.weight || ''}
                        onChange={(e) => updateSet(entryIdx, setIdx, 'weight', parseFloat(e.target.value) || 0)}
                        className="w-28"
                      />
                      <Button
                        variant={set.completed ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleSetComplete(entryIdx, setIdx)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setActiveSession(null)} className="flex-1">
            Annuler
          </Button>
          <Button onClick={finishWorkout} className="flex-1">
            Terminer l'entraînement
          </Button>
        </div>
      </div>
    );
  }

  // Program overview
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">{program.title}</h1>
        <p className="text-muted-foreground mt-1">Ton programme d'entraînement</p>
      </div>

      <div className="space-y-4">
        {program.blocks?.map((block: any, idx: number) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{block.name}</CardTitle>
                  <CardDescription>
                    {block.exercises?.length} exercices
                  </CardDescription>
                </div>
                <Button onClick={() => startWorkout(block)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Commencer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {block.exercises?.map((ex: any, exIdx: number) => (
                  <div key={exIdx} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <span className="font-medium">{ex.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {ex.sets?.length} x {ex.sets[0]?.reps} reps
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
