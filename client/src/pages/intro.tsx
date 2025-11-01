import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { useLocation } from 'wouter';
import { 
  Rocket, 
  Users, 
  BarChart3, 
  Utensils, 
  Dumbbell, 
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  GraduationCap
} from 'lucide-react';

interface Slide {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    icon: <Rocket className="w-20 h-20" />,
    title: "L'origine",
    description: "Synrgy est née d'une idée simple, mais forte : reconnecter l'humain à sa propre progression. J'ai passé des années à voir des coachs perdre du temps dans la gestion, des athlètes s'épuiser à suivre des méthodes qui ne leur ressemblaient pas. Alors, j'ai voulu créer un espace où la technologie ne remplace pas l'humain, mais l'amplifie. Un lieu où les efforts se traduisent en sens, et les données en confiance.",
    gradient: "from-orange-500 to-red-600"
  },
  {
    id: 2,
    icon: <Users className="w-20 h-20" />,
    title: "Le cœur du projet",
    description: "Synrgy, ce n'est pas une app. C'est un partenaire. Derrière chaque bouton, il y a une logique humaine : comprendre, adapter, accompagner. Que tu sois coach, athlète ou débutant, l'objectif est le même : t'aider à devenir meilleur, sans jamais te déconnecter de toi-même. Ici, chaque détail compte : ton sommeil, ton énergie, ton ressenti, ton rythme de vie.",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    id: 3,
    icon: <GraduationCap className="w-20 h-20" />,
    title: "Pour les coachs",
    description: "Tu accompagnes, tu inspires, tu motives. Mais gérer les suivis, les messages, les plans, peut devenir un fardeau. Synrgy simplifie tout cela, pour que tu retrouves l'essentiel : ton rôle d'humain auprès d'autres humains. Une interface claire, des outils intelligents, et surtout une IA qui t'aide — pas qui décide à ta place.",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    id: 4,
    icon: <Dumbbell className="w-20 h-20" />,
    title: "Pour les athlètes",
    description: "Ton corps évolue, ton mental aussi. Synrgy apprend à te connaître à travers tes ressentis, tes progrès, tes moments de doute. Chaque donnée collectée — ton poids, tes pas, ta faim, ton énergie — devient un signal d'ajustement. Ce n'est plus toi qui t'adaptes au programme, c'est le programme qui s'adapte à toi. Jour après jour, tu construis une version de toi plus forte, plus alignée, plus vivante.",
    gradient: "from-green-500 to-emerald-600"
  },
  {
    id: 5,
    icon: <Sparkles className="w-20 h-20" />,
    title: "La vision",
    description: "Synrgy, c'est plus qu'un outil. C'est une philosophie : celle du mouvement juste, de la cohérence, de la patience et de la progression consciente. C'est l'alliance de l'humain et de l'intelligence, du coach et de l'athlète, du savoir et du ressenti. Si tu es ici, c'est que tu veux avancer — pas juste t'entraîner. Alors bienvenue dans Synrgy. Commence ton aventure, et redonne du sens à chaque effort.",
    gradient: "from-yellow-500 to-orange-500"
  }
];

export default function IntroPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setLocation] = useLocation();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleGetStarted = () => {
    setLocation('/register');
  };

  const handleLogin = () => {
    setLocation('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#0F172A] overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
        {/* Slide content */}
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className={`inline-block p-6 rounded-full bg-gradient-to-br ${slides[currentSlide].gradient} mb-8 transform transition-transform duration-300 hover:scale-110`}>
                {slides[currentSlide].icon}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mb-12">
            <Button
              variant="ghost"
              size="lg"
              onClick={prevSlide}
              className="text-foreground hover:bg-white/10"
            >
              <ChevronLeft className="w-6 h-6 mr-2" />
              Précédent
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={nextSlide}
              className="text-foreground hover:bg-white/10"
            >
              Suivant
              <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          </div>

          {/* Slide indicators */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-12 bg-primary'
                    : 'bg-muted hover:bg-primary/50'
                }`}
              />
            ))}
          </div>

          {/* CTA buttons - only show on last slide */}
          {currentSlide === slides.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                className="btn-primary text-xl px-12 py-7 relative overflow-hidden group"
                onClick={handleGetStarted}
              >
                <span className="relative z-10 flex items-center">
                  Commencer mon aventure
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
              </Button>
            </motion.div>
          )}

          {/* Show navigation buttons on other slides */}
          {currentSlide < slides.length - 1 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setLocation('/register')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Passer l'intro
              </button>
            </div>
          )}
        </div>

        {/* Motivational quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-muted-foreground italic">
            "Tu n'as pas besoin d'être parfait, juste constant 💪"
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            — L'équipe Synrgy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
