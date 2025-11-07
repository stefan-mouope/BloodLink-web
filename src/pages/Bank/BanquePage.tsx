import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Heart, LogOut, Bell, User, Droplet, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import {
  getRequetesParBanque,
  getAlertesEnvoyeesParBanque,
  creerAlerte,
  validerRequete,
  Requete,
  Alerte,
} from "@/services/bank";

const BanquePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [stats, setStats] = useState({ total: 0, alertesCreees: 0, enAttente: 0 });

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  /** --- Requêtes de la banque --- */
  const { data: requetes = [], isLoading } = useQuery<Requete[]>({
    queryKey: ["requetes-banque", user?.id],
    enabled: !!user?.id && isAuthenticated,
    queryFn: () => getRequetesParBanque(user.id),
  });

  /** --- Alertes envoyées par la banque --- */
  const { data: alertes = [], isLoading: isLoadingAlertes, refetch } = useQuery<Alerte[]>({
    queryKey: ["alertes-envoyees", user?.id],
    enabled: !!user?.id && isAuthenticated,
    queryFn: () => getAlertesEnvoyeesParBanque(user.id),
  });

  /** --- Stats --- */
  useEffect(() => {
    if (!requetes) return;
    const total = requetes.length;
    const alertesCreees = requetes.filter(r => r.alertEnvoyee).length;
    const enAttente = requetes.filter(r => !r.alertEnvoyee).length;
    setStats({ total, alertesCreees, enAttente });
  }, [requetes]);

  /** --- Mutation pour créer une alerte --- */
  const mutationCreerAlerte = useMutation({
    mutationFn: (requete: Requete) => creerAlerte(requete.id, requete.groupe_sanguin),
    onSuccess: (_, requete) => {
      queryClient.setQueryData<Requete[]>(["requetes-banque", user?.id], (old) =>
        old?.map(r => (r.id === requete.id ? { ...r, alertEnvoyee: true } : r))
      );
      refetch(); // rafraîchir la liste des alertes
    },
  });

  /** --- Mutation pour valider une alerte --- */
  const mutationValider = useMutation({
  
    mutationFn: (requeteId: number) => validerRequete(requeteId),
    
    onSuccess: () => {
        alert('dshdsdhjs')
      refetch();
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
            <h1 className="text-2xl font-bold text-slate-800">
              {user?.prenom ? `${user.prenom} ${user.nom || ""}` : "Banque"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-rose-50 rounded-full">
              <Bell className="w-5 h-5 text-slate-600" />
              {stats.enAttente > 0 && (
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
        <Tabs defaultValue="requetes">
          <TabsList className="mb-6 bg-white shadow border border-rose-200">
            <TabsTrigger value="requetes">Requêtes reçues</TabsTrigger>
            <TabsTrigger value="alertes">Alertes envoyées</TabsTrigger>
          </TabsList>

          {/* Onglet Requêtes */}
          <TabsContent value="requetes">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-lg border-slate-200">
                  <CardHeader>
                    <CardTitle>Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>Total requêtes : {stats.total}</div>
                    <div>Alerte(s) créée(s) : {stats.alertesCreees}</div>
                    <div>En attente : {stats.enAttente}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-3">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  Requêtes reçues
                  {stats.total > 0 && <Badge variant="secondary">{stats.total}</Badge>}
                </h2>

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
                  </div>
                ) : requetes.length === 0 ? (
                  <Card className="shadow-lg border-slate-200">
                    <CardContent className="py-12 text-center">
                      <Droplet className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                      <p>Aucune requête pour le moment.</p>
                    </CardContent>
                  </Card>
                ) : (
                  requetes.map((req) => {
                    const docteur = req.docteur;
                    const banque = docteur?.banque;
                    return (
                      <Card key={req.id} className="hover:shadow-lg transition-all border-slate-200 hover:border-red-300">
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="text-lg font-semibold">{req.groupe_sanguin}</div>
                              <div>Quantité : {req.quantite} poches</div>
                              {banque && <div>Banque : {banque.nom} ({banque.localisation})</div>}
                            </div>
                            <div className="flex flex-col gap-2">
                              {!req.alertEnvoyee ? (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => mutationCreerAlerte.mutate(req)}
                                  disabled={mutationCreerAlerte.status === "pending"}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  {mutationCreerAlerte.status === "pending" ? "Création..." : "Créer alerte"}
                                </Button>
                              ) : (
                                <Badge variant="outline" className="text-green-600">
                                  Alerte envoyée ✅
                                </Badge>
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
          </TabsContent>

          {/* Onglet Alertes envoyées */}
          <TabsContent value="alertes">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              Alertes envoyées
              {alertes.length > 0 && <Badge variant="secondary">{alertes.length}</Badge>}
            </h2>

            {isLoadingAlertes ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
              </div>
            ) : alertes.length === 0 ? (
              <Card className="shadow-lg border-slate-200">
                <CardContent className="py-12 text-center">
                  <Bell className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                  <p>Aucune alerte envoyée pour le moment.</p>
                </CardContent>
              </Card>
            ) : (
              alertes.map((a) => (
                <Card
                  key={a.id}
                  className="hover:shadow-lg transition-all border-slate-200 hover:border-red-300"
                >
                  <CardContent className="p-5 flex justify-between items-start gap-4">
                    <div>
                      <div className="font-semibold text-lg">{a.groupe_sanguin}</div>
                      <div>Quantité : {a.requete.quantite} poches</div>
                      <div>
                        Docteur : {a.requete.docteur.nom} {a.requete.docteur.prenom}
                      </div>
                      <div>Date : {formatDate(a.date_envoi)}</div>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => mutationValider.mutate(a.id)}
                      disabled={mutationValider.status === "pending"}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      {mutationValider.status === "pending" ? "Validation..." : "Valider"}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BanquePage;
