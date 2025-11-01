import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useLocation } from 'wouter';
import { 
  GraduationCap, 
  Dumbbell, 
  Users, 
  ArrowRight,
  Mail,
  Lock,
  User,
  Hash,
  CheckCircle2
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

interface RegisterData {
  email: string;
  password: string;
  username: string;
  fullName: string;
  role: 'coach' | 'athlete' | 'client';
  referralCode?: string;
  coachCode?: string;
}

const roles = [
  {
    id: 'coach',
    name: 'Coach',
    description: 'Accompagne tes athlètes avec des outils professionnels',
    icon: GraduationCap,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30'
  },
  {
    id: 'athlete',
    name: 'Athlète Indépendant',
    description: 'Crée tes propres programmes et suive ta progression',
    icon: Dumbbell,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'client',
    name: 'Client d\'un Coach',
    description: 'Rejoins un coach et suive le programme personnalisé',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30'
  }
];

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<'coach' | 'athlete' | 'client' | null>(null);
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    username: '',
    fullName: '',
    role: 'athlete',
    referralCode: '',
    coachCode: ''
  });
  const [coachCodeValid, setCoachCodeValid] = useState<boolean | null>(null);
  const [, setLocation] = useLocation();

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiRequest('POST', '/api/auth/register', data);
      return response;
    },
    onSuccess: () => {
      setLocation('/login');
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
    }
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      return;
    }

    const data = {
      ...formData,
      role: selectedRole
    };

    await registerMutation.mutateAsync(data);
  };

  const handleRoleSelect = (role: 'coach' | 'athlete' | 'client') => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
  };

  const handleCoachCodeCheck = async (code: string) => {
    if (code.length >= 6) {
      try {
        const response = await fetch(`/api/referral/validate?code=${code}`);
        const data = await response.json();
        setCoachCodeValid(data.valid || false);
      } catch {
        setCoachCodeValid(false);
      }
    } else {
      setCoachCodeValid(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#0F172A] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Rejoins Synrgy
          </h1>
          <p className="text-xl text-muted-foreground">
            Choisis ton rôle et commence ta transformation
          </p>
        </motion.div>

        {/* Role selection cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: roles.indexOf(role) * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelect(role.id as 'coach' | 'athlete' | 'client')}
              >
                <Card 
                  className={`card cursor-pointer transition-all ${
                    isSelected 
                      ? `border-4 border-solid border-primary ${role.bgColor}` 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`inline-block p-4 rounded-full bg-gradient-to-br ${role.color} mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{role.name}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-4"
                      >
                        <CheckCircle2 className="w-6 h-6 text-primary mx-auto" />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Registration form */}
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <Card className="card">
              <CardHeader>
                <CardTitle>Créer mon compte</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName">Nom complet</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Jean Dupont"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="jean.dupont"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="jean@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {/* Coach Code (for coaches) */}
                  {selectedRole === 'coach' && (
                    <div>
                      <Label htmlFor="referralCode">Code de parrainage (optionnel)</Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="referralCode"
                          type="text"
                          placeholder="ABC123"
                          value={formData.referralCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, referralCode: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  )}

                  {/* Coach Code (for clients) */}
                  {selectedRole === 'client' && (
                    <div>
                      <Label htmlFor="coachCode">Code de ton coach</Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="coachCode"
                          type="text"
                          placeholder="Tape le code de ton coach"
                          value={formData.coachCode}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, coachCode: e.target.value }));
                            handleCoachCodeCheck(e.target.value);
                          }}
                          className="pl-10"
                          required
                        />
                        {coachCodeValid === true && (
                          <CheckCircle2 className="absolute right-3 top-3 w-5 h-5 text-secondary" />
                        )}
                      </div>
                      {coachCodeValid === false && (
                        <p className="text-sm text-danger mt-1">Code invalide</p>
                      )}
                    </div>
                  )}

                  {/* Submit button */}
                  <Button
                    type="submit"
                    className="w-full btn-primary"
                    disabled={registerMutation.isPending || (selectedRole === 'client' && coachCodeValid !== true)}
                  >
                    {registerMutation.isPending ? 'Création en cours...' : 'Créer mon compte'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {/* Login link */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setLocation('/login')}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Déjà un compte ? Se connecter
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
