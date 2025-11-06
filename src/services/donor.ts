import api from "./api";


export interface Alerte {
  id: number;
  statut: string;
  date_envoi?: string;
  titre?: string;
  message?: string;
  requete?: {
    id: number;
    groupe_sanguin?: string;
    quantite?: number;
    docteur?: {
      nom?: string;
      prenom?: string;
      BanqueDeSang?: {
        id?: number;
        nom?: string;
      } | null;
    } | null;
  } | null;
}

// 🔹 Récupérer toutes les alertes envoyées pour un groupe sanguin donné
export const getAlertesParGroupe = async (
  groupeSanguin: string
): Promise<Alerte[]> => {
  const res = await api.get(`/alertes/par-groupe/`, {
    params: { groupe_sanguin: groupeSanguin },
  });
  console.log(res.data)
  return res.data;
};

// 🔹 Mettre à jour le statut d'une alerte
export const updateStatutAlerte = async (
  id: number,
  statut: string
): Promise<Alerte> => {
  const res = await api.patch(`/alertes/${id}/mettre-a-jour-statut/`, { statut });
  return res.data;
};

