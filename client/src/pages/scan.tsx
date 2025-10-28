import React, { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Camera, Upload, QrCode, Plus, Trash2, Download, Loader2, CheckCircle, AlertCircle, History } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { useAppConfig } from "../lib/config";

interface ScanResult {
  id: string;
  type: "Repas" | "Exercice" | "QR";
  content: string;
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  timestamp: Date;
  imageUrl: string;
}

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  category: string;
}

export default function ScanPage() {
  const [, setLocation] = useLocation();
  const { data: config } = useAppConfig();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [myFoods, setMyFoods] = useState<FoodItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("scan");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // États pour l'ajout manuel
  const [newFood, setNewFood] = useState({
    name: "",
    calories: "",
    proteins: "",
    carbs: "",
    fats: "",
    category: "Autre"
  });

  // Charger les données depuis localStorage
  React.useEffect(() => {
    const savedHistory = localStorage.getItem('synrgy-scan-history');
    const savedFoods = localStorage.getItem('synrgy-my-foods');
    
    if (savedHistory) {
      try {
        setScanHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Erreur lors du chargement de l\'historique:', e);
      }
    }
    
    if (savedFoods) {
      try {
        setMyFoods(JSON.parse(savedFoods));
      } catch (e) {
        console.error('Erreur lors du chargement des aliments:', e);
      }
    }
  }, []);

  // Sauvegarder l'historique
  const saveToHistory = (result: ScanResult) => {
    const newHistory = [result, ...scanHistory].slice(0, 20);
    setScanHistory(newHistory);
    localStorage.setItem('synrgy-scan-history', JSON.stringify(newHistory));
  };

  // Sauvegarder les aliments
  const saveMyFoods = (foods: FoodItem[]) => {
    setMyFoods(foods);
    localStorage.setItem('synrgy-my-foods', JSON.stringify(foods));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      analyzeImage(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      setError('Impossible d\'accéder à la caméra');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
            analyzeImage(file);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOpen(false);
    }
  };

  const analyzeImage = async (file: File) => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/scan/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse');
      }

      const result = await response.json();
      const imageUrl = URL.createObjectURL(file);
      
      const scanResult: ScanResult = {
        id: Date.now().toString(),
        type: result.type,
        content: result.content,
        calories: result.calories,
        proteins: result.proteins,
        carbs: result.carbs,
        fats: result.fats,
        timestamp: new Date(),
        imageUrl,
      };

      setScanResult(scanResult);
      saveToHistory(scanResult);
    } catch (err) {
      setError('Erreur lors de l\'analyse de l\'image');
    } finally {
      setIsScanning(false);
    }
  };

  const scanQRCode = async () => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);

    try {
      const response = await fetch('/api/scan/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mock: true })
      });

      if (!response.ok) {
        throw new Error('Erreur lors du scan QR');
      }

      const result = await response.json();
      
      const scanResult: ScanResult = {
        id: Date.now().toString(),
        type: "QR",
        content: result.nom,
        calories: result.calories,
        proteins: result.proteines,
        carbs: result.glucides,
        fats: result.lipides,
        timestamp: new Date(),
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlFSIFNjYW48L3RleHQ+PC9zdmc+',
      };

      setScanResult(scanResult);
      saveToHistory(scanResult);
    } catch (err) {
      setError('Erreur lors du scan QR');
    } finally {
      setIsScanning(false);
    }
  };

  const addFoodManually = () => {
    if (!newFood.name || !newFood.calories) return;

    const food: FoodItem = {
      id: Date.now().toString(),
      name: newFood.name,
      calories: parseInt(newFood.calories),
      proteins: parseInt(newFood.proteins) || 0,
      carbs: parseInt(newFood.carbs) || 0,
      fats: parseInt(newFood.fats) || 0,
      category: newFood.category,
    };

    const updatedFoods = [...myFoods, food];
    saveMyFoods(updatedFoods);
    
    setNewFood({
      name: "",
      calories: "",
      proteins: "",
      carbs: "",
      fats: "",
      category: "Autre"
    });
  };

  const deleteFood = (id: string) => {
    const updatedFoods = myFoods.filter(food => food.id !== id);
    saveMyFoods(updatedFoods);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Nom', 'Calories', 'Protéines', 'Glucides', 'Lipides', 'Catégorie'],
      ...myFoods.map(food => [
        food.name,
        food.calories.toString(),
        food.proteins.toString(),
        food.carbs.toString(),
        food.fats.toString(),
        food.category
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mes-aliments.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const mockAnalysis = () => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);

    setTimeout(() => {
      const mockResults = [
        {
          type: "Repas",
          content: "Poulet basmati + légumes",
          calories: 480,
          proteins: 35,
          carbs: 50,
          fats: 8
        },
        {
          type: "Repas",
          content: "Yaourt grec nature + fruits",
          calories: 80,
          proteins: 9,
          carbs: 6,
          fats: 3
        },
        {
          type: "Exercice",
          content: "Squats avec haltères",
          reps: 12,
          sets: 3
        }
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      const imageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1vY2s8L3RleHQ+PC9zdmc+';
      
      const scanResult: ScanResult = {
        id: Date.now().toString(),
        ...randomResult,
        timestamp: new Date(),
        imageUrl,
      };

      setScanResult(scanResult);
      saveToHistory(scanResult);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            📸 Scan IA Synrgy Ultimate
          </h1>
          <p className="text-muted-foreground">
            Analysez vos repas, exercices et QR codes avec l'intelligence artificielle
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scan">Scan IA</TabsTrigger>
            <TabsTrigger value="foods">Ma Banque</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          {/* Tab Scan IA */}
          <TabsContent value="scan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Capture et analyse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isCameraOpen ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="h-20 flex flex-col gap-2"
                      variant="outline"
                    >
                      <Upload className="w-6 h-6" />
                      <span>Choisir une image</span>
                    </Button>
                    
                    <Button
                      onClick={startCamera}
                      className="h-20 flex flex-col gap-2"
                      variant="outline"
                    >
                      <Camera className="w-6 h-6" />
                      <span>Prendre une photo</span>
                    </Button>

                    <Button
                      onClick={scanQRCode}
                      className="h-20 flex flex-col gap-2"
                      variant="outline"
                    >
                      <QrCode className="w-6 h-6" />
                      <span>Scanner QR</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full max-w-md mx-auto rounded-lg"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={capturePhoto} className="flex gap-2">
                        <Camera className="w-4 h-4" />
                        Capturer
                      </Button>
                      <Button onClick={stopCamera} variant="outline">
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}

                {config?.testMode && (
                  <div className="text-center">
                    <Button onClick={mockAnalysis} variant="secondary" className="flex gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Test démo IA
                    </Button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* État de scan */}
            {isScanning && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Analyse en cours...</h3>
                  <p className="text-muted-foreground">
                    L'IA Synrgy analyse votre image pour détecter le contenu
                  </p>
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

            {/* Résultat */}
            {scanResult && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    Analyse terminée
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <img
                        src={scanResult.imageUrl}
                        alt="Image analysée"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{scanResult.type}</h3>
                        <p className="text-muted-foreground">{scanResult.content}</p>
                      </div>
                      
                      {scanResult.calories && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Calories:</span>
                            <span className="font-semibold">{scanResult.calories} kcal</span>
                          </div>
                          {scanResult.proteins && (
                            <div className="flex justify-between">
                              <span>Protéines:</span>
                              <span className="font-semibold">{scanResult.proteins} g</span>
                            </div>
                          )}
                          {scanResult.carbs && (
                            <div className="flex justify-between">
                              <span>Glucides:</span>
                              <span className="font-semibold">{scanResult.carbs} g</span>
                            </div>
                          )}
                          {scanResult.fats && (
                            <div className="flex justify-between">
                              <span>Lipides:</span>
                              <span className="font-semibold">{scanResult.fats} g</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-sm text-muted-foreground">
                        Analysé le {scanResult.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab Ma Banque */}
          <TabsContent value="foods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Ajouter un aliment
                  </span>
                  <Button onClick={exportToCSV} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom de l'aliment</Label>
                    <Input
                      id="name"
                      value={newFood.name}
                      onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                      placeholder="Ex: Pomme"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <select
                      id="category"
                      value={newFood.category}
                      onChange={(e) => setNewFood({...newFood, category: e.target.value})}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="Fruits">Fruits</option>
                      <option value="Légumes">Légumes</option>
                      <option value="Protéines">Protéines</option>
                      <option value="Céréales">Céréales</option>
                      <option value="Produits laitiers">Produits laitiers</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="calories">Calories (kcal)</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={newFood.calories}
                      onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
                      placeholder="52"
                    />
                  </div>
                  <div>
                    <Label htmlFor="proteins">Protéines (g)</Label>
                    <Input
                      id="proteins"
                      type="number"
                      value={newFood.proteins}
                      onChange={(e) => setNewFood({...newFood, proteins: e.target.value})}
                      placeholder="0.3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbs">Glucides (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      value={newFood.carbs}
                      onChange={(e) => setNewFood({...newFood, carbs: e.target.value})}
                      placeholder="14"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fats">Lipides (g)</Label>
                    <Input
                      id="fats"
                      type="number"
                      value={newFood.fats}
                      onChange={(e) => setNewFood({...newFood, fats: e.target.value})}
                      placeholder="0.2"
                    />
                  </div>
                </div>
                <Button onClick={addFoodManually} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter à ma banque
                </Button>
              </CardContent>
            </Card>

            {/* Liste des aliments */}
            <Card>
              <CardHeader>
                <CardTitle>Ma banque d'aliments ({myFoods.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myFoods.map((food) => (
                    <div key={food.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{food.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {food.calories} kcal • P: {food.proteins}g • C: {food.carbs}g • L: {food.fats}g
                        </p>
                        <span className="text-xs text-blue-600">{food.category}</span>
                      </div>
                      <Button
                        onClick={() => deleteFood(food.id)}
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {myFoods.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun aliment dans votre banque. Ajoutez-en un !
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Historique */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Historique des scans ({scanHistory.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scanHistory.map((scan) => (
                    <div key={scan.id} className="border rounded-lg p-3 space-y-2">
                      <img
                        src={scan.imageUrl}
                        alt="Scan"
                        className="w-full h-24 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium text-sm">{scan.type}</h4>
                        <p className="text-xs text-muted-foreground">{scan.content}</p>
                        {scan.calories && (
                          <p className="text-xs text-green-600">{scan.calories} kcal</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {scan.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {scanHistory.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-8">
                      Aucun scan dans l'historique. Commencez à scanner !
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => setLocation('/coach/dashboard')} variant="outline">
            Retour au dashboard
          </Button>
          <Button onClick={() => setLocation('/nutrition')} variant="outline">
            <span className="mr-2">📦</span>
            Importer depuis ma banque
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
