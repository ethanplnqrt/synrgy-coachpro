import React, { useState } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Construction, ArrowLeft, Wand2, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { useAppConfig } from '../lib/config';

export default function ProgramBuilder() {
  const { data: config } = useAppConfig();
  const [loading, setLoading] = useState(false);
  const [program, setProgram] = useState('');
  const [formData, setFormData] = useState({
    athleteName: '',
    level: '',
    goals: '',
    duration: '',
    focus: ''
  });

  const handleGenerateProgram = async () => {
    setLoading(true);
    try {
      const prompt = `Crée un programme d'entraînement complet pour ${formData.athleteName || 'un athlète'} de niveau ${formData.level || 'intermédiaire'}. Objectifs: ${formData.goals || 'amélioration générale'}. Durée: ${formData.duration || '4 semaines'}. Focus: ${formData.focus || 'force et endurance'}.`;
      
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: prompt }),
      });
      
      const data = await res.json();
      setProgram(data.reply || "Programme IA (démo) : 4 séances/semaine - Force, Endurance, Cardio, Repos.");
    } catch (e) {
      setProgram("Erreur IA — affichage d'un programme démo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/coach/dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au dashboard
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Wand2 className="w-5 h-5" />
                Génération de programme IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="athleteName">Nom de l'athlète</Label>
                <Input
                  id="athleteName"
                  placeholder="Ex: Marie Dubois"
                  value={formData.athleteName}
                  onChange={(e) => setFormData({...formData, athleteName: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="level">Niveau</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debutant">Débutant</SelectItem>
                    <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                    <SelectItem value="avance">Avancé</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="goals">Objectifs</Label>
                <Textarea
                  id="goals"
                  placeholder="Ex: Perte de poids, prise de masse, endurance..."
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="duration">Durée</Label>
                <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2 semaines">2 semaines</SelectItem>
                    <SelectItem value="4 semaines">4 semaines</SelectItem>
                    <SelectItem value="8 semaines">8 semaines</SelectItem>
                    <SelectItem value="12 semaines">12 semaines</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="focus">Focus d'entraînement</Label>
                <Select value={formData.focus} onValueChange={(value) => setFormData({...formData, focus: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le focus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="force">Force</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="musculation">Musculation</SelectItem>
                    <SelectItem value="perte-poids">Perte de poids</SelectItem>
                    <SelectItem value="prise-masse">Prise de masse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerateProgram} 
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Générer le programme
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Programme généré</CardTitle>
            </CardHeader>
            <CardContent>
              {program ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">{program}</pre>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Sauvegarder
                    </Button>
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Assigner à un athlète
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Construction className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p>Remplissez le formulaire et cliquez sur "Générer le programme"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
