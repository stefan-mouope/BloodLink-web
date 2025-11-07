import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  // Redirection selon rôle dès le chargement
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    switch (user?.user_type) {
      case "banque":
        navigate("/banque");
        break;
      case "docteur":
        navigate("/doctor");
        break;
      case "donneur":
        navigate("/donnor"); // nouvelle page Donor
        break;
      default:
        break;
    }
  }, [isAuthenticated, user, navigate]);

  const userName = useMemo(() => {
    if (!user) return "Utilisateur";
    return [user.prenom, user.nom].filter(Boolean).join(" ") || "Utilisateur";
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header minimal */}
      <header className="bg-card shadow-md sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">{userName}</h1>
            <p className="text-sm text-muted-foreground">{user?.user_type}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile")}
              className="hover:bg-primary/10"
            >
              <User className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="border-primary border-2 shadow-primary animate-slide-up">
          <CardHeader>
            <CardTitle>Bienvenue, {userName}</CardTitle>
            <CardDescription>Vous êtes connecté(e) en tant que {user?.user_type}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Utilisez la navigation pour accéder à votre espace.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
