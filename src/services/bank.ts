import api from "./api";

export interface Requete {
  id: number;
  groupe_sanguin: string;
  quantite: number;
  statut: string; // statut côté docteur
  docteur: {
    nom: string;
    prenom: string;
    code_inscription?: string;
    banque?: { nom: string; localisation: string } | null;
  };
}

export interface Alerte {
  id: number;
  date_envoi: string;
  statut: string;
  groupe_sanguin: string;
  requete: {
    id: number;
    groupe_sanguin: string;
    quantite: number;
    docteur: {
      nom: string;
      prenom: string;
      BanqueDeSang?: {
        id: number;
        nom: string;
        localisation: string;
      } | null;
    };
  };
}

// 🔹 Récupérer les requêtes pour une banque donnée
export const getRequetesParBanque = async (banqueId: number): Promise<Requete[]> => {
  const res = await api.get(`/requetes/par-banque/${banqueId}/`);
  return res.data;
};

// 🔹 Créer une alerte (on envoie seulement la requête et le groupe sanguin)
export const creerAlerte = async (requeteId: number, groupe_sanguin: string): Promise<void> => {
  await api.post("/alertes/", { requete: requeteId, groupe_sanguin });
};

// 🔹 Valider une requête après retour donneurs
export const validerRequete = async (requeteId: number): Promise<void> => {
  await api.patch(`/alertes/${requeteId}/mettre-a-jour-statut/`, { statut: "acceptee" });
};

// 🔹 Nouveau service : récupérer les alertes envoyées par une banque
export const getAlertesEnvoyeesParBanque = async (banqueId: number): Promise<Alerte[]> => {
  const res = await api.get(`/alertes/banque/?banque_id=${banqueId}`);
  return res.data;
};
