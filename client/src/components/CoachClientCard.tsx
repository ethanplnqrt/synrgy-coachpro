import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useLocation } from "wouter";

interface Client {
  id: string;
  name: string;
  progress: string;
  avatar: string;
  mainGoal: string;
  status: "progressing" | "stagnating" | "struggling";
}

interface CoachClientCardProps {
  client: Client;
}

export function CoachClientCard({ client }: CoachClientCardProps) {
  const [, setLocation] = useLocation();

  const statusConfig = {
    progressing: { 
      color: "bg-green-500", 
      textColor: "text-green-600", 
      bgColor: "bg-green-50 dark:bg-green-900/20",
      icon: TrendingUp,
      label: "En progrès"
    },
    stagnating: { 
      color: "bg-orange-500", 
      textColor: "text-orange-600", 
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      icon: Minus,
      label: "Stagnation"
    },
    struggling: { 
      color: "bg-red-500", 
      textColor: "text-red-600", 
      bgColor: "bg-red-50 dark:bg-red-900/20",
      icon: TrendingDown,
      label: "En difficulté"
    },
  };

  const config = statusConfig[client.status];
  const StatusIcon = config.icon;
  const progressValue = parseInt(client.progress);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="min-w-[280px]"
    >
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50" onClick={() => setLocation(`/coach/client/${client.id}`)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src={client.avatar} alt={client.name} />
              <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg truncate">{client.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{client.mainGoal}</p>
                </div>
                <Badge className={`${config.bgColor} ${config.textColor} border-0`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {config.label}
                </Badge>
              </div>

              <div className="space-y-2 mt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-semibold">{client.progress}</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 group"
                onClick={(e) => {
                  e.stopPropagation();
                  setLocation(`/coach/client/${client.id}`);
                }}
              >
                Voir les détails
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

