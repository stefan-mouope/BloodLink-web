import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Hospital, Users, Plus, Bell, User, LogOut, Clock, CheckCircle2 } from "lucide-react";

type UserRole = "doctor" | "blood_bank" | "donor";

interface Request {
  id: string;
  bloodType: string;
  hospital: string;
  urgency: "urgent" | "normal";
  status: "pending" | "completed";
  date: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("donor");
  const [userName, setUserName] = useState("");
  const [requests, setRequests] = useState<Request[]>([
    {
      id: "1",
      bloodType: "O+",
      hospital: "Hôpital Central",
      urgency: "urgent",
      status: "pending",
      date: "Il y a 5 min",
    },
    {
      id: "2",
      bloodType: "A+",
      hospital: "Clinique du Nord",
      urgency: "normal",
      status: "pending",
      date: "Il y a 1h",
    },
  ]);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/auth");
      return;
    }

    const userRole = localStorage.getItem("userRole") as UserRole;
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    setRole(userRole);
    setUserName(userData.fullName || userData.bankName || "Utilisateur");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const getRoleIcon = () => {
    switch (role) {
      case "doctor":
        return <Hospital className="w-6 h-6" />;
      case "blood_bank":
        return <Users className="w-6 h-6" />;
      default:
        return <Heart className="w-6 h-6" />;
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case "doctor":
        return "Docteur";
      case "blood_bank":
        return "Banque de sang";
      default:
        return "Donneur";
    }
  };

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Action */}
            {role === "doctor" && (
              <Card className="border-primary border-2 shadow-primary animate-slide-up hover:shadow-lg transition-smooth">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Plus className="w-6 h-6" />
                    Nouvelle demande
                  </CardTitle>
                  <CardDescription className="text-base">
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

            {role === "blood_bank" && (
              <Card className="border-primary border-2 shadow-primary animate-slide-up hover:shadow-lg transition-smooth">
                <CardHeader>
                  <CardTitle className="text-xl">Demandes reçues</CardTitle>
                  <CardDescription className="text-base">
                    Gérer les demandes et notifier les donneurs
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {role === "donor" && (
              <Card className="border-primary border-2 shadow-primary animate-slide-up hover:shadow-lg transition-smooth">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Heart className="w-6 h-6 text-primary fill-current" />
                    Alertes de don
                  </CardTitle>
                  <CardDescription className="text-base">
                    Un patient a besoin de votre aide
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {/* Requests List */}
            <div className="space-y-4">
              <h2 className="text-xl lg:text-2xl font-semibold">
                {role === "doctor" ? "Mes demandes" : role === "blood_bank" ? "Demandes actives" : "Alertes récentes"}
              </h2>
              
              {requests.map((request, index) => (
                <Card 
                  key={request.id} 
                  className="hover:shadow-lg hover:border-primary/50 transition-smooth cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xl lg:text-2xl font-bold text-primary">{request.bloodType}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{request.hospital}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>{request.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                        {request.urgency === "urgent" && (
                          <Badge variant="destructive" className="animate-pulse">
                            Urgent
                          </Badge>
                        )}
                        
                        {request.status === "completed" ? (
                          <Badge className="bg-success text-success-foreground">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Complété
                          </Badge>
                        ) : role === "donor" ? (
                          <Button variant="hero" size="sm" className="w-full sm:w-auto">
                            Je suis disponible
                          </Button>
                        ) : role === "blood_bank" ? (
                          <Button variant="default" size="sm" className="w-full sm:w-auto">
                            Notifier les donneurs
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-24 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 rounded-lg bg-primary/10 border-2 border-primary/20 hover:border-primary/40 transition-smooth">
                    <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                      {role === "donor" ? "12" : "47"}
                    </div>
                    <div className="text-sm lg:text-base text-muted-foreground font-medium">
                      {role === "donor" ? "Dons effectués" : "Demandes totales"}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
                      <div className="text-3xl font-bold text-success">
                        {role === "donor" ? "12" : "35"}
                      </div>
                      <div className="text-xs lg:text-sm text-muted-foreground mt-1">
                        Complétées
                      </div>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg bg-warning/10 border border-warning/20">
                      <div className="text-3xl font-bold text-warning">
                        {role === "donor" ? "0" : "12"}
                      </div>
                      <div className="text-xs lg:text-sm text-muted-foreground mt-1">
                        En attente
                      </div>
                    </div>
                  </div>

                  {role === "donor" && (
                    <div className="p-4 rounded-lg gradient-hero text-white text-center">
                      <div className="text-sm font-medium mb-1">Impact total</div>
                      <div className="text-3xl font-bold">36</div>
                      <div className="text-sm opacity-90 mt-1">Vies sauvées ❤️</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
