import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  LogOut,
  Bell,
  User,
  Clock,
  CheckCircle2,
  Activity,
  AlertCircle,
  TrendingUp,
  Droplet,
  Building2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { getAlertesParGroupe, updateStatutAlerte, Alerte } from "@/services/donor";

const Donnor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, logout } = useAuthStore();

  const [stats, setStats] = useState({ total: 0, accepted: 0, pending: 0 });

  const groupeSanguin: string | undefined =
    user?.groupe_sanguin || user?.donneur?.groupe_sanguin;

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const { data: alertes = [], isLoading } = useQuery<Alerte[]>({
    queryKey: ["alertes-par-groupe", groupeSanguin],
    enabled: !!groupeSanguin && isAuthenticated,
    queryFn: () => getAlertesParGroupe(groupeSanguin as string),
  });

  // Calculer les stats quand les alertes changent
  useEffect(() => {
    if (alertes && alertes.length > 0) {
      const accepted = alertes.filter((a) => a.statut === "acceptee").length;
      const pending = alertes.filter((a) => a.statut === "envoyee").length;
      setStats({ total: alertes.length, accepted, pending });
    } else {
      setStats({ total: 0, accepted: 0, pending: 0 });
    }
  }, [alertes]);

  const { mutate: accepterAlerte, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, statut }: { id: number; statut: string }) =>
      updateStatutAlerte(id, statut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alertes-par-groupe", groupeSanguin] });
    },
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-rose-100">
      {/* HEADER */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-rose-200 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {user?.prenom ? `${user.prenom} ${user.nom || ""}` : "Donneur"}
              </h1>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Donneur de sang {groupeSanguin ? `(${groupeSanguin})` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative hover:bg-rose-50 rounded-full">
              <Bell className="w-5 h-5 text-slate-600" />
              {stats.pending > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile")}
              className="hover:bg-slate-100 rounded-full"
            >
              <User className="w-5 h-5 text-slate-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hover:bg-red-50 hover:text-red-600 rounded-full"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLONNE GAUCHE - STATISTIQUES */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-blue-700 font-medium mt-1">Total des alertes</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="text-4xl font-bold text-green-600">{stats.accepted}</div>
                  <div className="text-sm text-green-700 font-medium mt-1">Alertes acceptées</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                  <div className="text-4xl font-bold text-amber-600">{stats.pending}</div>
                  <div className="text-sm text-amber-700 font-medium mt-1">En attente</div>
                </div>

                {stats.pending > 0 && (
                  <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{stats.pending} alerte{stats.pending > 1 ? "s" : ""} en attente</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* COLONNE DROITE - LISTE DES ALERTES */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              Alertes de sang
              {stats.total > 0 && (
                <Badge variant="secondary" className="text-base">
                  {stats.total}
                </Badge>
              )}
            </h2>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
              </div>
            ) : alertes.length === 0 ? (
              <Card className="shadow-lg border-slate-200">
                <CardContent className="py-12 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Droplet className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune alerte</h3>
                  <p className="text-slate-500 mb-6">
                    Aucune alerte pour votre groupe sanguin pour le moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              alertes.map((item) => {
                const docteur = item.requete?.docteur;
                const banque = docteur?.banque;
                return (
                  <Card
                    key={item.id}
                    className="hover:shadow-lg transition-all border-slate-200 hover:border-red-300 transform hover:-translate-y-0.5"
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                            {item.requete?.groupe_sanguin || "•"}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-800">
                              Besoin urgent de sang {item.requete?.groupe_sanguin}
                            </h3>
                            <p className="text-sm text-slate-600">
                              Quantité demandée :{" "}
                              <span className="font-medium">{item.requete?.quantite} poches</span>
                            </p>
                            {banque && (
                              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                <Building2 className="w-4 h-4" />
                                {banque.nom} ({banque.localisation})
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                              <Clock className="w-4 h-4" />
                              {formatDate(item.date_envoi)}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {item.statut === "acceptee" ? (
                            <Badge className="bg-green-500 hover:bg-green-600 text-white">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Acceptée
                            </Badge>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-red-500 hover:bg-red-600 text-white"
                              disabled={isUpdating}
                              onClick={() =>
                                accepterAlerte({ id: item.id, statut: "en_attente" })
                              }
                            >
                              Je suis disponible
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Donnor;