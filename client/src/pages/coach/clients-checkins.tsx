import { PageWrapper } from "@/components/PageWrapper";
import { CheckinList } from "@/components/CheckinList";
import { useAllCheckins } from "@/hooks/useCheckin";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle, TrendingUp, Calendar } from "lucide-react";

export default function CoachClientsCheckins() {
  const { checkins, loading } = useAllCheckins();

  const thisWeekCheckins = checkins.filter(c => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return c.timestamp > weekAgo;
  });

  const uniqueUsers = new Set(checkins.map(c => c.userId)).size;

  const avgCompliance = checkins.length > 0
    ? (checkins.reduce((sum, c) => {
        const sleep = Number(c.sleep) || 0;
        const energy = Number(c.energy) || 0;
        const mood = Number(c.mood) || 0;
        return sum + (sleep + energy + mood) / 3;
      }, 0) / checkins.length).toFixed(1)
    : "—";

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8" />
            Check-ins Clients
          </h1>
          <p className="text-muted-foreground mt-2">
            Vue d'ensemble des check-ins de tous tes clients
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
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
                  <p className="text-sm text-muted-foreground">Cette semaine</p>
                  <p className="text-2xl font-bold">{thisWeekCheckins.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clients actifs</p>
                  <p className="text-2xl font-bold">{uniqueUsers}</p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Score moyen</p>
                  <p className="text-2xl font-bold">{avgCompliance}/10</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Check-ins list */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Tous les check-ins</h2>
          {loading ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Chargement...
              </CardContent>
            </Card>
          ) : (
            <CheckinList checkins={checkins} showUserName />
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

