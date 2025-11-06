import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hospital, Bell, User, LogOut, Clock, CheckCircle2, Plus, Activity, TrendingUp, AlertCircle } from "lucide-react";
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

  const completedCount = requetes.filter(r => r.statut === "completed").length;
  const pendingCount = requetes.filter(r => r.statut !== "completed").length;

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Complété</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">En attente</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header amélioré */}
      <header className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-white/95 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
              <Hospital className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{userName}</h1>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Médecin praticien
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative hover:bg-red-50 rounded-full">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")} className="hover:bg-slate-100 rounded-full">
              <User className="w-5 h-5 text-slate-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600 rounded-full">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Statistiques et Action */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bouton créer une demande */}
            <Card 
              className="border-2 border-red-500 bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl shadow-red-500/20 hover:shadow-2xl hover:shadow-red-500/30 transition-all cursor-pointer transform hover:-translate-y-1"
              onClick={() => navigate("/requete")}
            >
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6" />
                </div>
                <CardTitle className="text-white text-xl">Nouvelle demande</CardTitle>
                <CardDescription className="text-red-100">
                  Créer une demande de sang pour un patient
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Statistiques */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="text-4xl font-bold text-blue-600">{requetes.length}</div>
                  <div className="text-sm text-blue-700 font-medium mt-1">Total des demandes</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="text-4xl font-bold text-green-600">{completedCount}</div>
                  <div className="text-sm text-green-700 font-medium mt-1">Demandes complétées</div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                  <div className="text-4xl font-bold text-amber-600">{pendingCount}</div>
                  <div className="text-sm text-amber-700 font-medium mt-1">En attente</div>
                </div>

                {pendingCount > 0 && (
                  <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{pendingCount} demande{pendingCount > 1 ? 's' : ''} nécessite{pendingCount > 1 ? 'nt' : ''} votre attention</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite - Liste des requêtes */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                Mes demandes de sang
                {requetes.length > 0 && (
                  <Badge variant="secondary" className="text-base">{requetes.length}</Badge>
                )}
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
              </div>
            ) : requetes.length === 0 ? (
              <Card className="shadow-lg border-slate-200">
                <CardContent className="py-12 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Hospital className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune demande</h3>
                  <p className="text-slate-500 mb-6">Vous n'avez pas encore créé de demande de sang</p>
                  <Button onClick={() => navigate("/requete")} className="bg-red-500 hover:bg-red-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer une demande
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {requetes.map((r, idx) => (
                  <Card 
                    key={r.id} 
                    className="hover:shadow-lg transition-all cursor-pointer border-slate-200 hover:border-red-300 transform hover:-translate-y-0.5"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                              {r.groupe_sanguin}
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-slate-800">
                                {r.quantite} {r.quantite > 1 ? 'unités' : 'unité'}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Clock className="w-4 h-4" />
                                {new Date(r.date_requete).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(r.statut)}
                          {r.statut === "completed" && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
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
      </main>
    </div>
  );
};

export default DoctorPage;