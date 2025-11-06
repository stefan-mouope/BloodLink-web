import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRequete } from "@/services/doctor";

const RequetePage = () => {
  const navigate = useNavigate();
  const [groupeSanguin, setGroupeSanguin] = useState("");
  const [quantite, setQuantite] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupeSanguin || !quantite) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      await createRequete({ groupe_sanguin: groupeSanguin, quantite: Number(quantite) });
      alert("✅ Requête envoyée !");
      navigate("/doctor"); // Retour à la page docteur
    } catch (err) {
      console.error(err);
      alert("❌ Impossible d’envoyer la requête");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nouvelle demande</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input placeholder="Groupe sanguin (ex: O+)" value={groupeSanguin} onChange={(e) => setGroupeSanguin(e.target.value)} />
        <Input type="number" placeholder="Quantité demandée (unités)" value={quantite} onChange={(e) => setQuantite(e.target.value)} />
        <Button type="submit" className="w-full">Faire une demande</Button>
      </form>
    </div>
  );
};

export default RequetePage;
