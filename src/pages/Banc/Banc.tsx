import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth";
import BankService, { Requete, Alerte } from "@/services/bank";
import {
  Hospital,
  Bell,
  User,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";

const Banc = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [requetes, setRequetes] = useState<Requete[]>([]);
  const [alertesEnvoyees, setAlertesEnvoyees] = useState<Alerte[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState<string | null>(null);

  const userName = user
    ? [user.prenom, user.nom].filter(Boolean).join(" ")
    : "Banque de Sang";

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
    fetchRequetes();
  }, [user, isAuthenticated, navigate]);

  const fetchRequetes = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const data = await BankService.getRequetesParBanque(user.id);
        setRequetes(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des requêtes :", error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertesEnvoyeesParBanque = async () => {
    try {
      if (user?.id) {
        const alertes = await BankService.getAlertesEnvoyeesParBanque(user.id);
        
        setAlertesEnvoyees(alertes);
        console.log("Alertes envoyées :", alertes);
        alert("Alertes envoyées chargées avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des alertes envoyées :", error);
      alert("Erreur lors du chargement des alertes envoyées");
    }
  };

  const handleCreerAlerte = async (requeteId: number, groupe: string) => {
    try {
      const alerte: Alerte = await BankService.creerAlerte(requeteId, groupe);
      alert("Alerte créée avec succès");
      fetchRequetes();
    } catch (error) {
      console.error("Erreur lors de la création de l'alerte :", error);
      alert("Erreur lors de la création de l'alerte");
    }
  };

  const handleValiderRequete = async (requeteId: number) => {
    try {
      const alertes = await BankService.getAlertesEnvoyeesParBanque(user?.id || 0);
      const alerte = alertes.find((a) => a.requete.id === requeteId);

      if (alerte) {
        await BankService.mettreAJourStatutAlerte(alerte.id, "acceptee");
        alert("Requête validée avec succès");
        fetchRequetes();
      } else {
        alert("Aucune alerte trouvée pour cette requête");
      }
    } catch (error) {
      console.error("Erreur lors de la validation :", error);
      alert("Erreur lors de la validation");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleClickEnvoyees = async () => {
    setFiltreStatut(filtreStatut === "envoyee" ? null : "envoyee");
    if (filtreStatut !== "envoyee") {
      await getAlertesEnvoyeesParBanque();
    }
  };

  const requetesFiltrees = filtreStatut
    ? requetes.filter((r) => r.statut === filtreStatut)
    : requetes;

  const compteurEnAttente = requetes.filter(
    (r) => r.statut === "en attente"
  ).length;
  const compteurEnvoye = requetes.filter(
    (r) => r.statut === "envoyee"
  ).length;
  const compteurValide = requetes.filter(
    (r) => r.statut === "acceptee"
  ).length;

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "en attente":
        return (
          <Badge className="bg-yellow-500 text-white flex items-center gap-1">
            <Clock className="w-3 h-3" />
            En attente
          </Badge>
        );
      case "envoyee":
        return (
          <Badge className="bg-blue-500 text-white flex items-center gap-1">
            <Send className="w-3 h-3" />
            Envoyée
          </Badge>
        );
      case "valide":
        return (
          <Badge className="bg-green-500 text-white flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Validée
          </Badge>
        );
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

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
              <p className="text-sm text-muted-foreground">Banque de Sang</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile")}
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

      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <Button
                variant={
                  filtreStatut === "en attente" ? "default" : "outline"
                }
                onClick={() =>
                  setFiltreStatut(
                    filtreStatut === "en attente" ? null : "en attente"
                  )
                }
                className="flex flex-col h-auto py-4"
              >
                <div className="text-3xl font-bold text-yellow-500">
                  {compteurEnAttente}
                </div>
                <div className="text-sm">En attente</div>
              </Button>

              <Button
                variant={filtreStatut === "envoyee" ? "default" : "outline"}
                onClick={handleClickEnvoyees}
                className="flex flex-col h-auto py-4"
              >
                <div className="text-3xl font-bold text-blue-500">
                  {compteurEnvoye}
                </div>
                <div className="text-sm">Envoyées</div>
              </Button>

              <Button
                variant={filtreStatut === "valide" ? "default" : "outline"}
                onClick={() =>
                  setFiltreStatut(filtreStatut === "valide" ? null : "valide")
                }
                className="flex flex-col h-auto py-4"
              >
                <div className="text-3xl font-bold text-green-500">
                  {compteurValide}
                </div>
                <div className="text-sm">Validées</div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des requêtes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {filtreStatut
              ? `Requêtes ${filtreStatut}`
              : "Toutes les requêtes"}
          </h2>

          {requetesFiltrees.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Aucune requête{" "}
                {filtreStatut ? `avec le statut "${filtreStatut}"` : ""}
              </CardContent>
            </Card>
          ) : (
            requetesFiltrees.map((req, idx) => (
              <Card key={req.id} className="hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-lg">
                          🩸 {req.groupe_sanguin} — {req.quantite} unités
                        </p>
                        {getStatutBadge(req.statut)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Clock className="w-4 h-4" />
                        {new Date(req.date_requete).toLocaleDateString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Docteur:{" "}
                        <b>
                          {req.docteur.nom} {req.docteur.prenom}
                        </b>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {req.statut === "en_attente" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleCreerAlerte(req.id, req.groupe_sanguin)
                          }
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Créer alerte
                        </Button>
                      )}
                      {req.statut === "envoyee" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleValiderRequete(req.id)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Valider
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Banc;
