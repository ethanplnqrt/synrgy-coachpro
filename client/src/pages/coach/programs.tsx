import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Program, User, InsertProgram } from "@shared/schema";

export default function CoachPrograms() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProgram, setNewProgram] = useState<InsertProgram>({
    name: "",
    description: "",
    coachId: "",
    clientId: null,
    durationWeeks: 4,
    status: "draft",
  });

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const { data: programs = [], isLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  const { data: clients = [] } = useQuery<User[]>({
    queryKey: ["/api/clients"],
  });

  const createProgramMutation = useMutation({
    mutationFn: async (data: InsertProgram) => {
      const res = await apiRequest("POST", "/api/programs", { ...data, coachId: user?.id });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      toast({
        title: "Programme créé",
        description: "Le programme a été créé avec succès",
      });
      setIsDialogOpen(false);
      setNewProgram({
        name: "",
        description: "",
        coachId: user?.id || "",
        clientId: null,
        durationWeeks: 4,
        status: "draft",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le programme",
        variant: "destructive",
      });
    },
  });

  const deleteProgramMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/programs/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      toast({
        title: "Programme supprimé",
        description: "Le programme a été supprimé avec succès",
      });
    },
  });

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    createProgramMutation.mutate(newProgram);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline", label: string }> = {
      draft: { variant: "secondary", label: "Brouillon" },
      active: { variant: "default", label: "Actif" },
      completed: { variant: "outline", label: "Terminé" },
    };
    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold" data-testid="text-page-title">
            Programmes d'entraînement
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos programmes et assignez-les à vos clients
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-program">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau programme
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un nouveau programme</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un programme d'entraînement
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProgram} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="program-name">Nom du programme</Label>
                <Input
                  id="program-name"
                  data-testid="input-program-name"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                  placeholder="Programme de force"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program-description">Description</Label>
                <Textarea
                  id="program-description"
                  data-testid="input-program-description"
                  value={newProgram.description || ""}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                  placeholder="Description du programme..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program-duration">Durée (semaines)</Label>
                <Input
                  id="program-duration"
                  data-testid="input-program-duration"
                  type="number"
                  min="1"
                  max="52"
                  value={newProgram.durationWeeks}
                  onChange={(e) => setNewProgram({ ...newProgram, durationWeeks: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program-client">Assigner à un client (optionnel)</Label>
                <Select
                  value={newProgram.clientId || "none"}
                  onValueChange={(value) =>
                    setNewProgram({ ...newProgram, clientId: value === "none" ? null : value })
                  }
                >
                  <SelectTrigger data-testid="select-program-client">
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun client</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={createProgramMutation.isPending}
                  className="flex-1"
                  data-testid="button-submit-program"
                >
                  {createProgramMutation.isPending ? "Création..." : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Programs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : programs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucun programme</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Créez votre premier programme d'entraînement pour vos clients
            </p>
            <Button onClick={() => setIsDialogOpen(true)} data-testid="button-create-first-program">
              <Plus className="w-4 h-4 mr-2" />
              Créer un programme
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Card key={program.id} className="hover-elevate" data-testid={`program-card-${program.id}`}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
                <div className="flex-1">
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  {getStatusBadge(program.status)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteProgramMutation.mutate(program.id)}
                  className="shrink-0"
                  data-testid={`button-delete-program-${program.id}`}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {program.description || "Aucune description"}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{program.durationWeeks} semaines</span>
                  </div>
                  {program.clientId && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs">Assigné</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
