import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Droplet, Package, Send, AlertCircle } from "lucide-react";
import { createRequete } from "@/services/doctor";

const RequetePage = () => {
  const navigate = useNavigate();
  const [groupeSanguin, setGroupeSanguin] = useState("");
  const [quantite, setQuantite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const groupesSanguins = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!groupeSanguin || !quantite) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (Number(quantite) <= 0) {
      setError("La quantité doit être supérieure à 0");
      return;
    }

    setLoading(true);
    try {
      await createRequete({ groupe_sanguin: groupeSanguin, quantite: Number(quantite) });
      navigate("/doctor");
    } catch (err) {
      console.error(err);
      setError("Impossible d'envoyer la requête. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/doctor")}
            className="hover:bg-slate-100 -ml-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Informations */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-slate-200 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader>
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/30 mb-3">
                  <Droplet className="w-6 h-6" />
                </div>
                <CardTitle className="text-red-900">Demande urgente</CardTitle>
                <CardDescription className="text-red-700">
                  Cette demande sera traitée en priorité par le service de transfusion sanguine.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800 text-base">Groupes sanguins disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {groupesSanguins.map((groupe) => (
                    <div
                      key={groupe}
                      className={`
                        p-2 rounded-lg text-center font-semibold text-sm cursor-pointer transition-all
                        ${groupeSanguin === groupe
                          ? 'bg-red-500 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }
                      `}
                      onClick={() => setGroupeSanguin(groupe)}
                    >
                      {groupe}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-slate-200 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Information importante</p>
                    <p className="text-blue-700">
                      Vérifiez attentivement le groupe sanguin et la quantité avant de soumettre la demande.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite - Formulaire */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-slate-200">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Send className="w-6 h-6" />
                  Nouvelle demande de sang
                </CardTitle>
                <CardDescription className="text-red-100">
                  Remplissez les informations ci-dessous pour créer une demande
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="groupe" className="text-slate-700 font-semibold flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-red-500" />
                      Groupe sanguin
                    </Label>
                    <div className="relative">
                      <Input
                        id="groupe"
                        placeholder="Sélectionnez ou tapez (ex: O+)"
                        value={groupeSanguin}
                        onChange={(e) => setGroupeSanguin(e.target.value.toUpperCase())}
                        className="h-12 text-lg border-slate-300 focus:border-red-500 focus:ring-red-500"
                        list="groupes-list"
                      />
                      <datalist id="groupes-list">
                        {groupesSanguins.map((g) => (
                          <option key={g} value={g} />
                        ))}
                      </datalist>
                    </div>
                    <p className="text-sm text-slate-500">
                      Cliquez sur un groupe dans la liste de gauche ou tapez manuellement
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantite" className="text-slate-700 font-semibold flex items-center gap-2">
                      <Package className="w-4 h-4 text-red-500" />
                      Quantité demandée
                    </Label>
                    <Input
                      id="quantite"
                      type="number"
                      min="1"
                      placeholder="Nombre d'unités (ex: 3)"
                      value={quantite}
                      onChange={(e) => setQuantite(e.target.value)}
                      className="h-12 text-lg border-slate-300 focus:border-red-500 focus:ring-red-500"
                    />
                    <p className="text-sm text-slate-500">
                      Indiquez le nombre d'unités de sang nécessaires
                    </p>
                  </div>

                  {groupeSanguin && quantite && (
                    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
                      <CardContent className="p-4">
                        <p className="text-sm font-semibold text-slate-700 mb-2">Résumé de la demande :</p>
                        <div className="flex items-center gap-2 text-slate-800">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-lg font-bold">
                            {groupeSanguin}
                          </span>
                          <span className="text-lg">×</span>
                          <span className="text-lg font-semibold">{quantite} {Number(quantite) > 1 ? 'unités' : 'unité'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/doctor")}
                      className="flex-1 h-12 border-slate-300 hover:bg-slate-100"
                      disabled={loading}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 font-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Soumettre la demande
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequetePage;