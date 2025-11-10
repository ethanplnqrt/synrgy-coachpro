import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Scale, Moon, Zap, Smile, CheckCircle } from "lucide-react";

interface CheckinFormProps {
  onSubmit: (data: {
    weight?: string;
    sleep?: string;
    energy?: string;
    mood?: string;
    notes?: string;
  }) => void;
  loading?: boolean;
}

export function CheckinForm({ onSubmit, loading }: CheckinFormProps) {
  const [weight, setWeight] = useState("");
  const [sleep, setSleep] = useState([7]);
  const [energy, setEnergy] = useState([7]);
  const [mood, setMood] = useState([7]);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    onSubmit({
      weight: weight || undefined,
      sleep: sleep[0].toString(),
      energy: energy[0].toString(),
      mood: mood[0].toString(),
      notes: notes || undefined,
    });

    // Reset form
    setWeight("");
    setSleep([7]);
    setEnergy([7]);
    setMood([7]);
    setNotes("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Check-in quotidien
        </CardTitle>
        <CardDescription>
          Enregistre tes données pour un suivi personnalisé avec analyse IA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weight */}
        <div className="space-y-2">
          <Label htmlFor="weight" className="flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Poids (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            placeholder="75.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Sleep */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Qualité du sommeil
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {sleep[0]}/10
            </span>
          </Label>
          <Slider
            value={sleep}
            onValueChange={setSleep}
            min={1}
            max={10}
            step={1}
            disabled={loading}
          />
        </div>

        {/* Energy */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Niveau d'énergie
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {energy[0]}/10
            </span>
          </Label>
          <Slider
            value={energy}
            onValueChange={setEnergy}
            min={1}
            max={10}
            step={1}
            disabled={loading}
          />
        </div>

        {/* Mood */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2">
              <Smile className="w-4 h-4" />
              Humeur générale
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {mood[0]}/10
            </span>
          </Label>
          <Slider
            value={mood}
            onValueChange={setMood}
            min={1}
            max={10}
            step={1}
            disabled={loading}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optionnel)</Label>
          <Textarea
            id="notes"
            placeholder="Comment te sens-tu ? Des douleurs, de la fatigue, une bonne performance ?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
            rows={3}
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          className="w-full" 
          disabled={loading}
        >
          {loading ? "Analyse en cours..." : "Soumettre et obtenir une analyse IA"}
        </Button>
      </CardContent>
    </Card>
  );
}

