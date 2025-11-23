import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Heart, LogOut, Bell, User, Droplet, CheckCircle2, AlertCircle, TrendingUp, Send, Clock, UserCircle } from "lucide-react";
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
const [stats, setStats] = useState({ total: 0, alertesCreees: 0, enAttente: 0, completes: 0 });

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  /** --- Requêtes de la banque --- */
  const { data: requetes = [], isLoading } = useQuery<Requete[]>({
    queryKey: ["requetes-banque", user?.id],
    enabled: !!user?.id && isAuthenticated,
    queryFn: () => getRequetesParBanque(user.id),
    refetchInterval: 10000,
  });

  /** --- Alertes envoyées par la banque --- */
  const { data: alertes = [], isLoading: isLoadingAlertes, refetch } = useQuery<Alerte[]>({
    queryKey: ["alertes-envoyees", user?.id],
    enabled: !!user?.id && isAuthenticated,
    queryFn: () => getAlertesEnvoyeesParBanque(user.id),
  });

  /** --- Stats --- */
useEffect(() => {
  if (!requetes || !alertes) return;
  const total = requetes.length;
  const alertesCreees = requetes.filter(r => r.alertEnvoyee).length;
  const enAttente = requetes.filter(r => !r.alertEnvoyee).length;
  const completes = alertes.filter(a => a.statut === "acceptee").length;
  setStats({ total, alertesCreees, enAttente, completes });
}, [requetes, alertes]);


  /** --- Mutation pour créer une alerte --- */
  const mutationCreerAlerte = useMutation({
    mutationFn: (requete: Requete) => creerAlerte(requete.id, requete.groupe_sanguin),
    onSuccess: (_, requete) => {
      queryClient.setQueryData<Requete[]>(["requetes-banque", user?.id], (old) =>
        old?.map(r => (r.id === requete.id ? { ...r, alertEnvoyee: true } : r))
      );
      refetch();
    },
  });

  /** --- Mutation pour valider une alerte --- */
  const mutationValider = useMutation({
    mutationFn: (requeteId: number) => validerRequete(requeteId),
    onSuccess: () => {
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

  const alertesValidees = alertes.filter(a => a.statut === "acceptee").length;
  const alertesEnAttente = alertes.filter(a => a.statut !== "acceptee").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-slate-50">
      {/* HEADER */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-slate-200 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {user?.prenom ? `${user.prenom} ${user.nom || ""}` : "Banque de sang"}
              </h1>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Droplet className="w-3 h-3" />
                Gestionnaire de banque
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative hover:bg-rose-50 rounded-full">
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
        <Tabs defaultValue="requetes" className="space-y-6">
          <TabsList className="bg-white shadow-lg border border-slate-200 p-1 rounded-lg">
            <TabsTrigger 
              value="requetes" 
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-md px-6"
            >
              <Droplet className="w-4 h-4 mr-2" />
              Requêtes reçues
              {stats.total > 0 && (
                <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700">
                  {stats.total}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="alertes"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-md px-6"
            >
              <Bell className="w-4 h-4 mr-2" />
              Alertes envoyées
              {alertes.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700">
                  {alertes.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Onglet Requêtes */}
          <TabsContent value="requetes">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne gauche - Statistiques */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-lg border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <TrendingUp className="w-5 h-5 text-red-500" />
                      Statistiques des requêtes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
                      <div className="text-sm text-blue-700 font-medium mt-1">Total des requêtes</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <div className="text-4xl font-bold text-green-600">{stats.alertesCreees}</div>
                      <div className="text-sm text-green-700 font-medium mt-1">Alertes créées</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                      <div className="text-4xl font-bold text-amber-600">{stats.enAttente}</div>
                      <div className="text-sm text-amber-700 font-medium mt-1">En attente</div>
                    </div>

                    {stats.enAttente > 0 && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{stats.enAttente} requête{stats.enAttente > 1 ? 's' : ''} nécessite{stats.enAttente > 1 ? 'nt' : ''} une alerte</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-slate-200 bg-gradient-to-br from-red-50 to-rose-100 border-red-200">
                  <CardHeader>
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/30 mb-3">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-red-900">Action requise</CardTitle>
                    <CardDescription className="text-red-700">
                      Créez des alertes pour notifier les donneurs disponibles et répondre aux demandes urgentes.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {/* Colonne droite - Liste des requêtes */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  Requêtes reçues
                </h2>

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
                  </div>
                ) : requetes.length === 0 ? (
                  <Card className="shadow-lg border-slate-200">
                    <CardContent className="py-12 text-center">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Droplet className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune requête</h3>
                      <p className="text-slate-500">Aucune demande de sang n'a été reçue pour le moment</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {requetes.map((req, idx) => {
                      const docteur = req.docteur;
                      const banque = docteur?.banque;
                      return (
                        <Card 
                          key={req.id} 
                          className="hover:shadow-lg transition-all border-slate-200 hover:border-red-300 transform hover:-translate-y-0.5"
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                                    {req.groupe_sanguin}
                                  </div>
                                  <div>
                                    <p className="text-lg font-semibold text-slate-800">
                                      {req.quantite} {req.quantite > 1 ? 'poches' : 'poche'}
                                    </p>
                                    {banque && (
                                      <p className="text-sm text-slate-500">
                                        {banque.nom} • {banque.localisation}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {docteur && (
                                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                    <UserCircle className="w-4 h-4" />
                                    <span>Dr. {docteur.nom} {docteur.prenom}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col gap-2">
                                {!req.alertEnvoyee ? (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => mutationCreerAlerte.mutate(req)}
                                    disabled={mutationCreerAlerte.status === "pending"}
                                    className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                                  >
                                    {mutationCreerAlerte.status === "pending" ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        Création...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Créer alerte
                                      </>
                                    )}
                                  </Button>
                                ) : (
                                  <Badge className="bg-green-500 text-white flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Alerte envoyée
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Onglet Alertes envoyées */}
          <TabsContent value="alertes">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne gauche - Statistiques des alertes */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-lg border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Bell className="w-5 h-5 text-red-500" />
                      Statistiques des alertes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <div className="text-4xl font-bold text-blue-600">{alertes.length}</div>
                      <div className="text-sm text-blue-700 font-medium mt-1">Total des alertes</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <div className="text-4xl font-bold text-green-600">{alertesValidees}</div>
                      <div className="text-sm text-green-700 font-medium mt-1">Alertes validées</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                      <div className="text-4xl font-bold text-amber-600">{alertesEnAttente}</div>
                      <div className="text-sm text-amber-700 font-medium mt-1">En attente</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-slate-200 bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Information</p>
                        <p className="text-blue-700">
                          Validez les alertes une fois que les donneurs ont répondu positivement.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Colonne droite - Liste des alertes */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  Alertes envoyées
                </h2>

                {isLoadingAlertes ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
                  </div>
                ) : alertes.length === 0 ? (
                  <Card className="shadow-lg border-slate-200">
                    <CardContent className="py-12 text-center">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune alerte</h3>
                      <p className="text-slate-500">Aucune alerte n'a été envoyée pour le moment</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {alertes.map((a, idx) => (
                      <Card
                        key={a.id}
                        className="hover:shadow-lg transition-all border-slate-200 hover:border-red-300 transform hover:-translate-y-0.5"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                                  {a.groupe_sanguin}
                                </div>
                                <div>
                                  <p className="text-lg font-semibold text-slate-800">
                                    {a.requete.quantite} {a.requete.quantite > 1 ? 'poches' : 'poche'}
                                  </p>
                                  <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Clock className="w-4 h-4" />
                                    {formatDate(a.date_envoi)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                <UserCircle className="w-4 h-4" />
                                <span>Dr. {a.requete.docteur.nom} {a.requete.docteur.prenom}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              {a.statut !== "acceptee" ? (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => mutationValider.mutate(a.id)}
                                  disabled={mutationValider.status === "pending"}
                                  className="bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30"
                                >
                                  {mutationValider.status === "pending" ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                      Validation...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="w-4 h-4 mr-2" />
                                      Valider
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <Badge className="bg-green-500 text-white flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Validée
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BanquePage;