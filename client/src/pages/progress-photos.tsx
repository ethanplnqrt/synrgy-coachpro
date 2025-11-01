import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Slider } from '../components/ui/slider';
import { 
  Camera, 
  Upload, 
  RotateCcw, 
  Download, 
  Calendar,
  Scale,
  TrendingUp,
  Eye,
  EyeOff,
  Plus,
  Trash2
} from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../hooks/useAuth';

interface ProgressPhoto {
  id: string;
  date: string;
  weight: number;
  angles: {
    front: string;
    side: string;
    back: string;
  };
  notes: string;
}

export default function ProgressPhotosPage() {
  const { data: user } = useAuth();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonSlider, setComparisonSlider] = useState([50]);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  // Mock data
  useEffect(() => {
    const mockPhotos: ProgressPhoto[] = [
      {
        id: '1',
        date: '2024-01-15',
        weight: 75.2,
        angles: {
          front: 'https://via.placeholder.com/300x400/4ADE80/FFFFFF?text=Front+Jan+15',
          side: 'https://via.placeholder.com/300x400/60A5FA/FFFFFF?text=Side+Jan+15',
          back: 'https://via.placeholder.com/300x400/F59E0B/FFFFFF?text=Back+Jan+15'
        },
        notes: 'Première photo de progression, objectif perte de graisse'
      },
      {
        id: '2',
        date: '2024-01-22',
        weight: 74.8,
        angles: {
          front: 'https://via.placeholder.com/300x400/4ADE80/FFFFFF?text=Front+Jan+22',
          side: 'https://via.placeholder.com/300x400/60A5FA/FFFFFF?text=Side+Jan+22',
          back: 'https://via.placeholder.com/300x400/F59E0B/FFFFFF?text=Back+Jan+22'
        },
        notes: 'Une semaine de progression, déjà des changements visibles'
      },
      {
        id: '3',
        date: '2024-01-29',
        weight: 74.5,
        angles: {
          front: 'https://via.placeholder.com/300x400/4ADE80/FFFFFF?text=Front+Jan+29',
          side: 'https://via.placeholder.com/300x400/60A5FA/FFFFFF?text=Side+Jan+29',
          back: 'https://via.placeholder.com/300x400/F59E0B/FFFFFF?text=Back+Jan+29'
        },
        notes: 'Progression continue, définition musculaire plus visible'
      }
    ];
    setPhotos(mockPhotos);
    if (mockPhotos.length > 0) {
      setSelectedPhoto(mockPhotos[mockPhotos.length - 1]);
    }
  }, []);

  const handlePhotoUpload = () => {
    // Simuler l'upload de photos
    const newPhoto: ProgressPhoto = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      weight: 74.2,
      angles: {
        front: 'https://via.placeholder.com/300x400/FF6B3D/FFFFFF?text=Front+Today',
        side: 'https://via.placeholder.com/300x400/FF6B3D/FFFFFF?text=Side+Today',
        back: 'https://via.placeholder.com/300x400/FF6B3D/FFFFFF?text=Back+Today'
      },
      notes: 'Photo du jour'
    };
    setPhotos(prev => [...prev, newPhoto]);
    setSelectedPhoto(newPhoto);
  };

  const deletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(photos.length > 1 ? photos[photos.length - 2] : null);
    }
  };

  const getWeightChange = (currentWeight: number, previousWeight?: number) => {
    if (!previousWeight) return null;
    const change = currentWeight - previousWeight;
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : 'down',
      color: change > 0 ? 'text-danger' : 'text-secondary'
    };
  };

  const getBeforeAfterPhotos = () => {
    if (photos.length < 2) return null;
    const sortedPhotos = [...photos].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return {
      before: sortedPhotos[0],
      after: sortedPhotos[sortedPhotos.length - 1]
    };
  };

  const beforeAfter = getBeforeAfterPhotos();

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
            <h1 className="text-3xl font-bold text-foreground">Photos de progression</h1>
            <p className="text-muted-foreground mt-2">
              Suis ton évolution physique avec des photos multi-angles
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-border"
              onClick={() => setShowBeforeAfter(!showBeforeAfter)}
            >
              {showBeforeAfter ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showBeforeAfter ? 'Masquer' : 'Comparer'} avant/après
            </Button>
            <Button className="btn-primary" onClick={handlePhotoUpload}>
              <Camera className="w-4 h-4 mr-2" />
              Nouvelle photo
            </Button>
          </div>
        </motion.div>

        {/* Before/After Comparison */}
        {showBeforeAfter && beforeAfter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Comparaison avant/après
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-foreground mb-2">Avant</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {beforeAfter.before.date} • {beforeAfter.before.weight}kg
                    </p>
                    <div className="relative">
                      <img
                        src={beforeAfter.before.angles.front}
                        alt="Avant"
                        className="w-full max-w-sm mx-auto rounded-lg border border-border"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-foreground mb-2">Après</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {beforeAfter.after.date} • {beforeAfter.after.weight}kg
                    </p>
                    <div className="relative">
                      <img
                        src={beforeAfter.after.angles.front}
                        alt="Après"
                        className="w-full max-w-sm mx-auto rounded-lg border border-border"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
                    <Scale className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Évolution du poids:</span>
                    <span className={`font-semibold ${getWeightChange(beforeAfter.after.weight, beforeAfter.before.weight)?.color}`}>
                      {getWeightChange(beforeAfter.after.weight, beforeAfter.before.weight)?.direction === 'up' ? '+' : '-'}
                      {getWeightChange(beforeAfter.after.weight, beforeAfter.before.weight)?.value}kg
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="card">
              <CardHeader>
                <CardTitle>Galerie de photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {photos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPhoto?.id === photo.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {new Date(photo.date).toLocaleDateString('fr-FR')}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {photo.weight}kg • {photo.notes}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="badge-primary">
                            {photo.weight}kg
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePhoto(photo.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <img
                            src={photo.angles.front}
                            alt="Front"
                            className="w-full h-24 object-cover rounded border border-border"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Face</p>
                        </div>
                        <div className="text-center">
                          <img
                            src={photo.angles.side}
                            alt="Side"
                            className="w-full h-24 object-cover rounded border border-border"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Profil</p>
                        </div>
                        <div className="text-center">
                          <img
                            src={photo.angles.back}
                            alt="Back"
                            className="w-full h-24 object-cover rounded border border-border"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Dos</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Photo Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle>Détails de la photo</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPhoto ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <img
                        src={selectedPhoto.angles.front}
                        alt="Selected photo"
                        className="w-full rounded-lg border border-border"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Date</span>
                        <span className="font-semibold">
                          {new Date(selectedPhoto.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Poids</span>
                        <span className="font-semibold">{selectedPhoto.weight}kg</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Évolution</span>
                        <span className="font-semibold text-secondary">
                          {getWeightChange(selectedPhoto.weight, photos[photos.indexOf(selectedPhoto) - 1]?.weight)?.value || 0}kg
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Notes
                      </label>
                      <p className="text-sm text-muted-foreground bg-surface p-3 rounded-lg">
                        {selectedPhoto.notes}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        Télécharger
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Partager
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Sélectionne une photo pour voir les détails</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Upload Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Instructions pour de meilleures photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Éclairage</h4>
                  <p className="text-sm text-muted-foreground">
                    Utilise un éclairage naturel et uniforme pour des photos claires
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Scale className="w-8 h-8 text-secondary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Position</h4>
                  <p className="text-sm text-muted-foreground">
                    Même position et distance à chaque photo pour une comparaison précise
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-info/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-info" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Régularité</h4>
                  <p className="text-sm text-muted-foreground">
                    Prends des photos chaque semaine à la même heure pour suivre l'évolution
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
