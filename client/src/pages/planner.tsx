import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Calendar, Clock, Plus, Trash2, Bell, Loader2, CheckCircle, AlertCircle, Dumbbell, Utensils } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { useAppConfig } from "../lib/config";

interface PlannerEvent {
  id: string;
  title: string;
  type: "workout" | "meal" | "appointment" | "reminder";
  date: string;
  time: string;
  duration: number;
  description: string;
  completed: boolean;
  reminder: boolean;
}

interface Notification {
  id: string;
  message: string;
  time: Date;
  read: boolean;
}

export default function PlannerPage() {
  const [, setLocation] = useLocation();
  const { data: config } = useAppConfig();
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Formulaire pour ajouter un événement
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "workout" as const,
    date: selectedDate,
    time: "09:00",
    duration: 60,
    description: "",
    reminder: true
  });

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('synrgy-planner-events');
    const savedNotifications = localStorage.getItem('synrgy-notifications');
    
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (e) {
        console.error('Erreur lors du chargement des événements:', e);
      }
    }
    
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        console.error('Erreur lors du chargement des notifications:', e);
      }
    }
  }, []);

  // Sauvegarder les événements
  const saveEvents = (events: PlannerEvent[]) => {
    setEvents(events);
    localStorage.setItem('synrgy-planner-events', JSON.stringify(events));
  };

  // Sauvegarder les notifications
  const saveNotifications = (notifications: Notification[]) => {
    setNotifications(notifications);
    localStorage.setItem('synrgy-notifications', JSON.stringify(notifications));
  };

  // Ajouter un événement
  const addEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;

    const event: PlannerEvent = {
      id: Date.now().toString(),
      ...newEvent,
      completed: false
    };

    const updatedEvents = [...events, event];
    saveEvents(updatedEvents);

    // Programmer une notification si activée
    if (newEvent.reminder) {
      scheduleNotification(event);
    }

    // Réinitialiser le formulaire
    setNewEvent({
      title: "",
      type: "workout",
      date: selectedDate,
      time: "09:00",
      duration: 60,
      description: "",
      reminder: true
    });
    setShowAddForm(false);
  };

  // Programmer une notification
  const scheduleNotification = (event: PlannerEvent) => {
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    const reminderTime = new Date(eventDateTime.getTime() - 30 * 60 * 1000); // 30 min avant

    if (reminderTime > new Date()) {
      const notification: Notification = {
        id: Date.now().toString(),
        message: `Rappel: ${event.title} dans 30 minutes`,
        time: reminderTime,
        read: false
      };

      const updatedNotifications = [...notifications, notification];
      saveNotifications(updatedNotifications);

      // Programmer la notification réelle
      setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`Synrgy - ${event.title}`, {
            body: `Votre ${event.type === 'workout' ? 'séance' : 'repas'} commence dans 30 minutes`,
            icon: '/favicon.ico'
          });
        }
      }, reminderTime.getTime() - new Date().getTime());
    }
  };

  // Supprimer un événement
  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    saveEvents(updatedEvents);
  };

  // Marquer comme terminé
  const toggleComplete = (id: string) => {
    const updatedEvents = events.map(event => 
      event.id === id ? { ...event, completed: !event.completed } : event
    );
    saveEvents(updatedEvents);
  };

  // Charger les événements depuis l'API
  const loadEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/planner/events');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }

      const result = await response.json();
      saveEvents(result);
    } catch (err) {
      setError('Erreur lors du chargement des événements');
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarder les événements sur l'API
  const saveEventsToAPI = async () => {
    try {
      const response = await fetch('/api/planner/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(events)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    }
  };

  // Mock data pour le mode démo
  const mockLoadEvents = () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const mockEvents: PlannerEvent[] = [
        {
          id: "1",
          title: "Séance HIIT",
          type: "workout",
          date: selectedDate,
          time: "08:00",
          duration: 45,
          description: "Entraînement haute intensité",
          completed: false,
          reminder: true
        },
        {
          id: "2",
          title: "Petit-déjeuner",
          type: "meal",
          date: selectedDate,
          time: "09:00",
          duration: 30,
          description: "Oatmeal + fruits",
          completed: true,
          reminder: false
        },
        {
          id: "3",
          title: "Consultation coach",
          type: "appointment",
          date: selectedDate,
          time: "14:00",
          duration: 60,
          description: "Bilan mensuel",
          completed: false,
          reminder: true
        }
      ];

      saveEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  };

  // Obtenir les événements du jour sélectionné
  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  // Obtenir l'icône selon le type
  const getEventIcon = (type: string) => {
    switch (type) {
      case "workout": return <Dumbbell className="w-4 h-4" />;
      case "meal": return <Utensils className="w-4 h-4" />;
      case "appointment": return <Calendar className="w-4 h-4" />;
      case "reminder": return <Bell className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Obtenir la couleur selon le type
  const getEventColor = (type: string) => {
    switch (type) {
      case "workout": return "bg-blue-100 text-blue-800 border-blue-200";
      case "meal": return "bg-green-100 text-green-800 border-green-200";
      case "appointment": return "bg-purple-100 text-purple-800 border-purple-200";
      case "reminder": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Demander la permission pour les notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const todayEvents = getEventsForDate(selectedDate);

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            📅 Planificateur Intelligent
          </h1>
          <p className="text-muted-foreground">
            Organisez vos séances, repas et rendez-vous avec des rappels automatiques
          </p>
        </div>

        {/* Contrôles */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
              
              <div className="flex gap-2">
                {config?.testMode && (
                  <Button onClick={mockLoadEvents} variant="secondary" size="sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Charger démo
                  </Button>
                )}
                <Button onClick={loadEvents} variant="outline" size="sm" disabled={isLoading}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
                <Button onClick={saveEventsToAPI} variant="outline" size="sm">
                  💾 Sauvegarder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un événement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Ex: Séance HIIT"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent({...newEvent, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workout">💪 Entraînement</SelectItem>
                      <SelectItem value="meal">🍎 Repas</SelectItem>
                      <SelectItem value="appointment">📅 Rendez-vous</SelectItem>
                      <SelectItem value="reminder">🔔 Rappel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="eventDate">Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Heure</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Durée (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({...newEvent, duration: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="reminder"
                    checked={newEvent.reminder}
                    onChange={(e) => setNewEvent({...newEvent, reminder: e.target.checked})}
                  />
                  <Label htmlFor="reminder">Rappel 30 min avant</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Détails de l'événement..."
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={addEvent}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline">
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Événements du jour */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Événements du {new Date(selectedDate).toLocaleDateString('fr-FR')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Chargement des événements...</p>
              </div>
            ) : todayEvents.length > 0 ? (
              <div className="space-y-3">
                {todayEvents.map((event) => (
                  <div key={event.id} className={`flex items-center justify-between p-4 border rounded-lg ${getEventColor(event.type)}`}>
                    <div className="flex items-center gap-3">
                      {getEventIcon(event.type)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{event.title}</h3>
                          {event.completed && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm opacity-75">
                          {event.time} • {event.duration} min
                        </p>
                        {event.description && (
                          <p className="text-sm opacity-75">{event.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => toggleComplete(event.id)}
                        variant="outline"
                        size="sm"
                      >
                        {event.completed ? 'Annuler' : 'Terminer'}
                      </Button>
                      <Button
                        onClick={() => deleteEvent(event.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Aucun événement</h3>
                <p className="text-muted-foreground mb-4">
                  Aucun événement prévu pour cette date
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  Ajouter un événement
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        {notifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications ({notifications.filter(n => !n.read).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className={`p-3 border rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time.toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Erreur */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2 text-destructive">Erreur</h3>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => setLocation('/coach/dashboard')} variant="outline">
            Retour au dashboard
          </Button>
          <Button onClick={() => setLocation('/challenges')} variant="outline">
            Voir les défis
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

