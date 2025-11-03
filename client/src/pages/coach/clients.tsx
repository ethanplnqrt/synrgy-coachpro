import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, User as UserIcon, Trash2, Users } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export default function CoachClients() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const { data: clients = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/clients"],
  });

  const createClientMutation = useMutation({
    mutationFn: async (data: typeof newClient) => {
      const res = await apiRequest("POST", "/api/clients", {
        ...data,
        role: "client",
        coachId: user?.id,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Client ajouté",
        description: "Le client a été ajouté avec succès",
      });
      setIsDialogOpen(false);
      setNewClient({ fullName: "", email: "", username: "", password: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le client",
        variant: "destructive",
      });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/clients/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès",
      });
    },
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    createClientMutation.mutate(newClient);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const myClients = clients.filter((c) => c.coachId === user?.id);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold" data-testid="text-page-title">
            Mes clients
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos clients et suivez leur progression
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-client">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau client</DialogTitle>
              <DialogDescription>
                Créez un compte pour votre nouveau client
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-fullname">Nom complet</Label>
                <Input
                  id="client-fullname"
                  data-testid="input-client-fullname"
                  value={newClient.fullName}
                  onChange={(e) => setNewClient({ ...newClient, fullName: e.target.value })}
                  placeholder="Jean Dupont"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="client-email"
                    data-testid="input-client-email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="jean@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-username">Nom d'utilisateur</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="client-username"
                    data-testid="input-client-username"
                    value={newClient.username}
                    onChange={(e) => setNewClient({ ...newClient, username: e.target.value })}
                    placeholder="jeandupont"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-password">Mot de passe initial</Label>
                <Input
                  id="client-password"
                  data-testid="input-client-password"
                  type="password"
                  value={newClient.password}
                  onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
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
                  disabled={createClientMutation.isPending}
                  className="flex-1"
                  data-testid="button-submit-client"
                >
                  {createClientMutation.isPending ? "Ajout..." : "Ajouter"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Clients Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : myClients.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucun client</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Commencez par ajouter votre premier client
            </p>
            <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-first-client">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un client
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myClients.map((client) => (
            <Card key={client.id} className="hover-elevate" data-testid={`client-card-${client.id}`}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={client.avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(client.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{client.fullName}</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">
                      Client
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteClientMutation.mutate(client.id)}
                  className="shrink-0"
                  data-testid={`button-delete-client-${client.id}`}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                  <span>@{client.username}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
