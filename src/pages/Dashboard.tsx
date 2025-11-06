import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Hospital, Users, Plus, Bell, User, LogOut, Clock, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

type UserRole = "docteur" | "banque" | "donneur";

interface UiItem {
  id: string | number;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: "destructive" | "default";
  status?: "pending" | "completed";
  dateText?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const role: UserRole | undefined = user?.user_type;

  const userName = useMemo(() => {
    if (!user) return "Utilisateur";
    if (user.user_type === "banque") return user.nom ?? "Banque";
    if (user.user_type === "docteur") return [user.prenom, user.nom].filter(Boolean).join(" ") || "Docteur";
    if (user.user_type === "donneur") return [user.prenom, user.nom].filter(Boolean).join(" ") || "Donneur";
    return "Utilisateur";
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const getRoleIcon = () => {
    switch (role) {
      case "docteur":
        return <Hospital className="w-6 h-6" />;
      case "banque":
        return <Users className="w-6 h-6" />;
      default:
        return <Heart className="w-6 h-6" />;
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case "docteur":
        return "Docteur";
      case "banque":
        return "Banque de sang";
      default:
        return "Donneur";
    }
  };

  // Fetch role-specific items from backend
  const { data: items = [], isLoading } = useQuery<UiItem[]>({
    queryKey: ["dashboard-items", role],
    enabled: !!role && isAuthenticated,
    queryFn: async () => {
      if (role === "docteur") {
        // Ex: demandes du docteur
        const r = await api.get<any[]>("/requetes/");
        return (r.data || []).map((it: any) => ({
          id: it.id,
          title: it.groupe_sanguin ? `Besoin ${it.groupe_sanguin}` : `Demande #${it.id}`,
          subtitle: it.hopital || it.hôpital || it.hospital || it.patient || "—",
          badge: it.urgence ? String(it.urgence) : undefined,
          badgeVariant: it.urgence === "urgent" ? "destructive" : "default",
          status: it.statut === "completed" ? "completed" : "pending",
          dateText: it.created_at || it.date || "",
        }));
      }
      if (role === "banque") {
        // Ex: alertes pour banque
        const r = await api.get<any[]>("/alertes/");
        return (r.data || []).map((it: any) => ({
          id: it.id,
          title: it.titre || it.groupe_sanguin || `Alerte #${it.id}`,
          subtitle: it.message || it.description || it.region || it.localisation || "—",
          badge: it.niveau || it.priorite,
          badgeVariant: (it.niveau || it.priorite) === "urgent" ? "destructive" : "default",
          status: it.statut === "completed" ? "completed" : "pending",
          dateText: it.created_at || it.date || "",
        }));
      }
      // donneur
      const r = await api.get<any[]>("/notifications/");
      return (r.data || []).map((it: any) => ({
        id: it.id,
        title: it.titre || it.groupe_sanguin || `Notification #${it.id}`,
        subtitle: it.description || it.message || it.hopital || "—",
        badge: it.type,
        badgeVariant: it.type === "urgent" ? "destructive" : "default",
        status: it.statut === "completed" ? "completed" : "pending",
        dateText: it.created_at || it.date || "",
      }));
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <header className="bg-card shadow-md sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-primary">
                {getRoleIcon()}
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold">{userName}</h1>
                <p className="text-sm text-muted-foreground">{getRoleLabel()}</p>
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
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Quick Action */}
        {role === "docteur" && (
          <Card className="border-primary border-2 shadow-primary animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nouvelle demande
              </CardTitle>
              <CardDescription>
                Créer une demande de sang pour un patient
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="hero" size="lg" className="w-full">
                Faire une demande
              </Button>
            </CardContent>
          </Card>
        )}

        {role === "banque" && (
          <Card className="border-primary border-2 shadow-primary animate-slide-up">
            <CardHeader>
              <CardTitle>Demandes reçues</CardTitle>
              <CardDescription>
                Gérer les demandes et notifier les donneurs
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {role === "donneur" && (
          <Card className="border-primary border-2 shadow-primary animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary fill-current" />
                Alertes de don
              </CardTitle>
              <CardDescription>
                Un patient a besoin de votre aide
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Requests List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {role === "docteur" ? "Mes demandes" : role === "banque" ? "Demandes/Alertes actives" : "Notifications/Alertes"}
          </h2>
          
          {(isLoading ? [] : items).map((item, index) => (
            <Card 
              key={item.id} 
              className="hover:shadow-md transition-smooth cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{item.badge || "•"}</span>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {item.dateText || ""}
                      </div>
                      {item.subtitle && <div className="text-sm text-muted-foreground">{item.subtitle}</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {item.badgeVariant === "destructive" && (
                      <Badge variant="destructive" className="animate-pulse">
                        Urgent
                      </Badge>
                    )}
                    
                    {item.status === "completed" ? (
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Complété
                      </Badge>
                    ) : role === "donneur" ? (
                      <Button variant="hero" size="sm">
                        Je suis disponible
                      </Button>
                    ) : role === "banque" ? (
                      <Button variant="default" size="sm">
                        Notifier les donneurs
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{role === "donneur" ? "12" : "47"}</div>
                <div className="text-sm text-muted-foreground">
                  {role === "donneur" ? "Dons" : "Demandes"}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success">{role === "donneur" ? "12" : "35"}</div>
                <div className="text-sm text-muted-foreground">Complétées</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-warning">{role === "donneur" ? "0" : "12"}</div>
                <div className="text-sm text-muted-foreground">En attente</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
