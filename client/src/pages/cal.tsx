import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, Users, Video, Plus, Filter, Search } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'wouter';

interface Booking {
  id: string;
  title: string;
  athleteName: string;
  startTime: string;
  endTime: string;
  type: 'consultation' | 'check_in' | 'training' | 'nutrition';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  videoUrl?: string;
}

export default function CalPage() {
  const { data: user } = useAuth();
  const [, setLocation] = useLocation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');

  // Mock data
  useEffect(() => {
    const mockBookings: Booking[] = [
      {
        id: '1',
        title: 'Consultation initiale',
        athleteName: 'Léa Martin',
        startTime: '09:00',
        endTime: '10:00',
        type: 'consultation',
        status: 'confirmed',
        videoUrl: 'https://meet.google.com/abc-defg-hij'
      },
      {
        id: '2',
        title: 'Check-in hebdomadaire',
        athleteName: 'Maxime Dubois',
        startTime: '14:00',
        endTime: '14:30',
        type: 'check_in',
        status: 'scheduled'
      },
      {
        id: '3',
        title: 'Séance de coaching',
        athleteName: 'Sarah Johnson',
        startTime: '16:00',
        endTime: '17:00',
        type: 'training',
        status: 'scheduled'
      }
    ];
    setBookings(mockBookings);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'badge-success';
      case 'scheduled': return 'badge-primary';
      case 'completed': return 'badge-secondary';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-primary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <Users className="w-4 h-4" />;
      case 'check_in': return <Clock className="w-4 h-4" />;
      case 'training': return <Calendar className="w-4 h-4" />;
      case 'nutrition': return <Users className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Planning & Rendez-vous</h1>
            <p className="text-muted-foreground mt-2">
              Gère tes disponibilités et tes rendez-vous avec tes athlètes
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-border">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau RDV
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">RDV aujourd'hui</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cette semaine</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                </div>
                <Clock className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taux de présence</p>
                  <p className="text-2xl font-bold text-foreground">94%</p>
                </div>
                <Users className="w-8 h-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenus</p>
                  <p className="text-2xl font-bold text-foreground">€1,240</p>
                </div>
                <Video className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Calendar View Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            onClick={() => setView('day')}
            size="sm"
          >
            Jour
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            onClick={() => setView('week')}
            size="sm"
          >
            Semaine
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            onClick={() => setView('month')}
            size="sm"
          >
            Mois
          </Button>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Rendez-vous du {selectedDate.toLocaleDateString('fr-FR')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getTypeIcon(booking.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{booking.title}</h3>
                        <p className="text-sm text-muted-foreground">{booking.athleteName}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.startTime} - {booking.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      {booking.videoUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(booking.videoUrl, '_blank')}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Rejoindre
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        Détails
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Availability Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card">
            <CardHeader>
              <CardTitle>Disponibilités</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Horaires récurrents</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                      <span className="text-sm">Lundi - Vendredi</span>
                      <span className="text-sm text-muted-foreground">09:00 - 18:00</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                      <span className="text-sm">Samedi</span>
                      <span className="text-sm text-muted-foreground">10:00 - 16:00</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                      <span className="text-sm">Dimanche</span>
                      <span className="text-sm text-muted-foreground">Fermé</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Types de rendez-vous</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                      <span className="text-sm">Consultation</span>
                      <span className="text-sm text-muted-foreground">60 min</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                      <span className="text-sm">Check-in</span>
                      <span className="text-sm text-muted-foreground">30 min</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                      <span className="text-sm">Séance coaching</span>
                      <span className="text-sm text-muted-foreground">60 min</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Modifier les disponibilités
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
