import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Mail, Phone, MapPin, Building2, Droplet } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>({});
  const [role, setRole] = useState("");

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/auth");
      return;
    }

    const userRole = localStorage.getItem("userRole");
    const data = JSON.parse(localStorage.getItem("userData") || "{}");
    setUserData(data);
    setRole(userRole || "");
  }, [navigate]);

  const getInitials = () => {
    const name = userData.fullName || userData.bankName || "U";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleLabel = () => {
    switch (role) {
      case "doctor":
        return "Docteur";
      case "blood_bank":
        return "Banque de sang";
      case "donor":
        return "Donneur";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <header className="bg-card shadow-md sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Profile Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <Card className="shadow-lg animate-slide-up border-2">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <Avatar className="w-28 h-28 lg:w-32 lg:h-32 border-4 border-primary shadow-primary flex-shrink-0">
                    <AvatarFallback className="bg-primary text-white text-3xl lg:text-4xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center sm:text-left space-y-3">
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                        {userData.fullName || userData.bankName}
                      </h1>
                      <Badge variant="outline" className="text-base px-4 py-1">
                        {getRoleLabel()}
                      </Badge>
                    </div>

                    {role === "donor" && (
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-primary pt-2">
                        <Droplet className="w-6 h-6 fill-current" />
                        <span className="text-2xl font-bold">{userData.bloodType}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl lg:text-2xl">Informations</CardTitle>
                <CardDescription>Détails de votre profil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-smooth">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium truncate">{userData.email}</p>
                  </div>
                </div>

                {role === "donor" && userData.phone && (
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-smooth">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium">{userData.phone}</p>
                    </div>
                  </div>
                )}

                {role === "doctor" && userData.hospital && (
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-smooth">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Hôpital</p>
                      <p className="font-medium">{userData.hospital}</p>
                    </div>
                  </div>
                )}

                {role === "blood_bank" && (
                  <>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-smooth">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">Nom de la banque</p>
                        <p className="font-medium">{userData.bankName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-smooth">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">Localisation</p>
                        <p className="font-medium">{userData.location}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Stats & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Statistics Card */}
            {role === "donor" && (
              <Card className="shadow-lg border-primary border-2 sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Heart className="w-6 h-6 text-primary fill-current" />
                    Mon impact
                  </CardTitle>
                  <CardDescription>Votre contribution en chiffres</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 rounded-lg bg-primary/10 border-2 border-primary/20">
                    <div className="text-5xl font-bold text-primary mb-2">12</div>
                    <div className="text-sm text-muted-foreground">Dons effectués</div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
                      <div className="text-3xl font-bold text-success">12</div>
                      <div className="text-sm text-muted-foreground mt-1">Vies sauvées</div>
                    </div>

                    <div className="p-4 rounded-lg gradient-hero text-white text-center">
                      <p className="text-sm font-medium mb-1">Prochain don dans</p>
                      <p className="text-2xl font-bold">2 mois</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Card className="shadow-lg">
              <CardContent className="pt-6 space-y-3">
                <Button variant="outline" size="lg" className="w-full hover:bg-primary/10 hover:border-primary">
                  Modifier le profil
                </Button>
                <Button variant="destructive" size="lg" className="w-full" onClick={() => {
                  localStorage.clear();
                  navigate("/auth");
                }}>
                  Se déconnecter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
