import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hospital, Bell, User, LogOut, Clock, CheckCircle2, Plus } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { getRequetes, Requete } from "@/services/doctor";

const DoctorPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [requetes, setRequetes] = useState<Requete[]>([]);
  const [loading, setLoading] = useState(false);

  const userName = user ? [user.prenom, user.nom].filter(Boolean).join(" ") : "Docteur";

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
    loadRequetes();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const loadRequetes = async () => {
    setLoading(true);
    try {
      const data = await getRequetes();
      setRequetes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <header className="bg-card shadow-md sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-primary">
              <Hospital className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold">{userName}</h1>
              <p className="text-sm text-muted-foreground">Docteur</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")} className="hover:bg-primary/10">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Bouton créer une demande */}
        <Card className="border-primary border-2 shadow-primary cursor-pointer" onClick={() => navigate("/requete")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nouvelle demande
            </CardTitle>
            <CardDescription>Créer une demande de sang pour un patient</CardDescription>
          </CardHeader>
        </Card>

        {/* Liste des requêtes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Mes demandes</h2>
          {(loading ? [] : requetes).map((r, idx) => (
            <Card key={r.id} className="hover:shadow-md transition-smooth cursor-pointer" style={{ animationDelay: `${idx * 0.05}s` }}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p>🩸 {r.groupe_sanguin} — {r.quantite} unités</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" /> {new Date(r.date_requete).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Statut: <b>{r.statut}</b>
                  </p>
                </div>
                {r.statut === "completed" && (
                  <Badge className="bg-success text-success-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Complété
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{requetes.length}</div>
                <div className="text-sm text-muted-foreground">Demandes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success">{requetes.filter(r => r.statut === "completed").length}</div>
                <div className="text-sm text-muted-foreground">Complétées</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-warning">{requetes.filter(r => r.statut !== "completed").length}</div>
                <div className="text-sm text-muted-foreground">En attente</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DoctorPage;
