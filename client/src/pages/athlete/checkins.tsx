import { PageWrapper } from "@/components/PageWrapper";
import { CheckinForm } from "@/components/CheckinForm";
import { CheckinList } from "@/components/CheckinList";
import { useCheckin } from "@/hooks/useCheckin";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, TrendingUp, Target } from "lucide-react";

export default function AthleteCheckins() {
  const { checkins, loading, submitting, submitCheckin, lastCheckin } = useCheckin();

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CheckCircle className="w-8 h-8" />
            Mes Check-ins
          </h1>
          <p className="text-muted-foreground mt-2">
            Suis ton évolution avec l'analyse IA Synrgy et optimise ta progression
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total check-ins</p>
                  <p className="text-2xl font-bold">{checkins.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Constance (7j)</p>
                  <p className="text-2xl font-bold">
                    {checkins.filter(c => {
                      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
                      return c.timestamp > weekAgo;
                    }).length}/7
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Récupération moy.</p>
                  <p className="text-2xl font-bold">
                    {checkins.length > 0
                      ? (checkins.reduce((sum, c) => {
                          const sleep = Number(c.sleep) || 0;
                          const energy = Number(c.energy) || 0;
                          return sum + (sleep + energy) / 2;
                        }, 0) / checkins.length).toFixed(1)
                      : "—"}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <CheckinForm onSubmit={submitCheckin} loading={submitting} />

        {/* Latest analysis highlight */}
        {lastCheckin?.aiAnalysis && (
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Check-in enregistré !
              </h3>
              <p className="text-sm text-muted-foreground">{lastCheckin.aiAnalysis}</p>
            </CardContent>
          </Card>
        )}

        {/* History */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Historique</h2>
          {loading ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Chargement...
              </CardContent>
            </Card>
          ) : (
            <CheckinList checkins={checkins} />
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

