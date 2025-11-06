import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Users, Hospital, ChevronRight, ChevronLeft } from "lucide-react";

const slides = [
  {
    icon: Hospital,
    title: "Les docteurs font des demandes",
    description: "Les médecins créent des demandes de sang urgentes pour leurs patients en quelques clics.",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Les banques notifient les donneurs",
    description: "Les banques de sang alertent instantanément les donneurs compatibles par groupe sanguin.",
    color: "text-accent",
  },
  {
    icon: Heart,
    title: "Les donneurs sauvent des vies",
    description: "Chaque don de sang compte. Rejoignez une communauté de héros du quotidien.",
    color: "text-primary",
  },
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/auth");
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex flex-col lg:flex-row">

      {/* Right Side - Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Header (Mobile only) */}
        <div className="p-6 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">BloodLink</h1>
              <p className="text-xs text-muted-foreground">Sauvez des vies, un don à la fois</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-20">
          <div className="w-full max-w-xl space-y-8 lg:space-y-12 animate-slide-up">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-card shadow-primary flex items-center justify-center transition-all hover:scale-105">
                <Icon className={`w-16 h-16 lg:w-20 lg:h-20 ${slide.color}`} />
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-4 lg:space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{slide.title}</h2>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">{slide.description}</p>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 pt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all hover:opacity-80 ${
                    index === currentSlide ? "w-8 bg-primary" : "w-2 bg-border"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6 lg:p-8 space-y-4 max-w-xl mx-auto w-full">
          <Button 
            onClick={nextSlide} 
            variant="hero" 
            size="lg" 
            className="w-full"
          >
            {currentSlide === slides.length - 1 ? "Commencer" : "Suivant"}
            <ChevronRight className="w-5 h-5" />
          </Button>

          {currentSlide > 0 && (
            <Button 
              onClick={prevSlide} 
              variant="ghost" 
              size="lg" 
              className="w-full"
            >
              <ChevronLeft className="w-5 h-5" />
              Précédent
            </Button>
          )}

          {currentSlide === 0 && (
            <Button 
              onClick={() => navigate("/auth")} 
              variant="link" 
              className="w-full"
            >
              Passer l'introduction
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
