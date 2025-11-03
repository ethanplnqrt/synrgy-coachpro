import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Moon, Zap, Smile, Calendar, Brain } from "lucide-react";
import { motion } from "framer-motion";

interface Checkin {
  id: string;
  userId: string;
  userName?: string;
  weight?: string;
  sleep?: string;
  energy?: string;
  mood?: string;
  notes?: string;
  timestamp: number;
  aiAnalysis?: string;
}

interface CheckinListProps {
  checkins: Checkin[];
  showUserName?: boolean;
}

export function CheckinList({ checkins, showUserName = false }: CheckinListProps) {
  if (checkins.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucun check-in pour l'instant</p>
            <p className="text-sm mt-2">Commence ton suivi quotidien !</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-3">
      {checkins.map((checkin, index) => (
        <motion.div
          key={checkin.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(checkin.timestamp).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </CardTitle>
                {showUserName && checkin.userName && (
                  <Badge variant="outline">{checkin.userName}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {checkin.weight && (
                  <div className="flex items-center gap-2 text-sm">
                    <Scale className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{checkin.weight} kg</span>
                  </div>
                )}
                {checkin.sleep && (
                  <div className="flex items-center gap-2 text-sm">
                    <Moon className="w-4 h-4 text-muted-foreground" />
                    <span className={`font-medium ${getScoreColor(Number(checkin.sleep))}`}>
                      {checkin.sleep}/10
                    </span>
                  </div>
                )}
                {checkin.energy && (
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className={`font-medium ${getScoreColor(Number(checkin.energy))}`}>
                      {checkin.energy}/10
                    </span>
                  </div>
                )}
                {checkin.mood && (
                  <div className="flex items-center gap-2 text-sm">
                    <Smile className="w-4 h-4 text-muted-foreground" />
                    <span className={`font-medium ${getScoreColor(Number(checkin.mood))}`}>
                      {checkin.mood}/10
                    </span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {checkin.notes && (
                <div className="text-sm bg-muted/50 rounded-md p-3">
                  <p className="text-muted-foreground italic">{checkin.notes}</p>
                </div>
              )}

              {/* AI Analysis */}
              {checkin.aiAnalysis && (
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-md p-3 border border-primary/10">
                  <div className="flex items-start gap-2">
                    <Brain className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-primary mb-1">Analyse IA Synrgy</p>
                      <p className="text-foreground/90">{checkin.aiAnalysis}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

