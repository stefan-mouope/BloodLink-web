import api from "./api";

export interface RequeteData {
  groupe_sanguin: string;
  quantite: number;
}

export interface Requete {
  id: number;
  date_requete: string;
  groupe_sanguin: string;
  quantite: number;
  statut: string;
  docteur: {
    nom: string;
    prenom: string;
    code_inscription: string;
    est_verifie: boolean;
    BanqueDeSang_id: number | null;
    BanqueDeSang_nom: string | null;
  };
}

// 🔹 Récupérer toutes les requêtes du docteur connecté
export const getRequetes = async (): Promise<Requete[]> => {
  const res = await api.get("/requetes/");
  return res.data;
};

// 🔹 Créer une nouvelle requête (faire une demande)
export const createRequete = async (data: RequeteData): Promise<Requete> => {
  const res = await api.post("/requetes/", data);
  return res.data;
};

// 🔹 Mettre à jour le statut d'une requête (utilisé par la banque)
export const updateStatutRequete = async (
  id: number,
  statut: string
): Promise<Requete> => {
  const res = await api.patch(`/requetes/${id}/mettre-a-jour-statut/`, {
    statut,
  });
  return res.data;
};

// 🔹 Obtenir les requêtes liées à une banque spécifique
export const getRequetesParBanque = async (
  banqueId: number
): Promise<Requete[]> => {
  const res = await api.get(`/requetes/par-banque/${banqueId}/`);
  return res.data;
};
