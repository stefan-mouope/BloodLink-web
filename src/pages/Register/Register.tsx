import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AuthApi, BanksApi } from "@/services/users";
import { useQuery } from "@tanstack/react-query";

type UserRole = "docteur" | "banque" | "donneur";
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Register = () => {
  const [role, setRole] = useState<UserRole>("donneur");
  const [formData, setFormData] = useState({
    email: "", password: "", nom: "", prenom: "", groupe_sanguin: "",
    code_inscription: "", BanqueDeSang: "", localisation: ""
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const { data: banks = [], isLoading: banksLoading } = useQuery({
    queryKey: ["banks"],
    enabled: role === "docteur",
    queryFn: () => BanksApi.list(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { email: formData.email, password: formData.password, user_type: role };
      if (role === "donneur") Object.assign(payload, { nom: formData.nom, prenom: formData.prenom, groupe_sanguin: formData.groupe_sanguin });
      if (role === "docteur") Object.assign(payload, { nom: formData.nom, prenom: formData.prenom, code_inscription: formData.code_inscription, BanqueDeSang: formData.BanqueDeSang ? Number(formData.BanqueDeSang) : undefined });
      if (role === "banque") Object.assign(payload, { nom: formData.nom, localisation: formData.localisation, code_inscription: formData.code_inscription });

      await AuthApi.register(payload);
      setFormData({ ...formData, password: "" });
      toast({ title: "Inscription réussie !", description: "Veuillez vous connecter avec vos identifiants." });
      navigate("/login");
    } catch (err: any) {
      const description = err?.response?.data?.detail || err?.response?.data || "Une erreur est survenue";
      toast({ title: "Erreur", description: String(description) });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-lg border-2">
        <CardHeader className="space-y-2 pb-6 text-center">
          <CardTitle className="text-2xl">Inscription</CardTitle>
          <CardDescription>Créez votre compte BloodLink</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label>Je suis :</Label>
              <RadioGroup value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <div className="flex items-center space-x-2 p-3 rounded-lg border-2 hover:border-primary cursor-pointer">
                  <RadioGroupItem value="docteur" id="docteur" />
                  <Label htmlFor="docteur" className="cursor-pointer flex-1 font-normal">👨‍⚕️ Docteur</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border-2 hover:border-primary cursor-pointer">
                  <RadioGroupItem value="banque" id="banque" />
                  <Label htmlFor="banque" className="cursor-pointer flex-1 font-normal">🏥 Banque de sang</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border-2 hover:border-primary cursor-pointer">
                  <RadioGroupItem value="donneur" id="donneur" />
                  <Label htmlFor="donneur" className="cursor-pointer flex-1 font-normal">❤️ Donneur</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Dynamic Fields */}
            {role === "donneur" && <>
              <InputField id="nom" label="Nom *" value={formData.nom} onChange={(v) => handleInputChange("nom", v)} />
              <InputField id="prenom" label="Prénom *" value={formData.prenom} onChange={(v) => handleInputChange("prenom", v)} />
              <SelectField id="groupe_sanguin" label="Groupe sanguin *" options={bloodTypes} value={formData.groupe_sanguin} onChange={(v) => handleInputChange("groupe_sanguin", v)} />
            </>}

            {role === "docteur" && <>
              <InputField id="nom" label="Nom *" value={formData.nom} onChange={(v) => handleInputChange("nom", v)} />
              <InputField id="prenom" label="Prénom *" value={formData.prenom} onChange={(v) => handleInputChange("prenom", v)} />
              <InputField id="code_inscription" label="Code d'inscription *" value={formData.code_inscription} onChange={(v) => handleInputChange("code_inscription", v)} />
              <SelectField id="BanqueDeSang" label="Banque de sang *" options={banks.map(b => ({ label: b.nom, value: String(b.id) }))} value={formData.BanqueDeSang} onChange={(v) => handleInputChange("BanqueDeSang", v)} loading={banksLoading} />
            </>}

            {role === "banque" && <>
              <InputField id="nom" label="Nom de la banque *" value={formData.nom} onChange={(v) => handleInputChange("nom", v)} />
              <InputField id="localisation" label="Localisation *" value={formData.localisation} onChange={(v) => handleInputChange("localisation", v)} />
              <InputField id="code_inscription" label="Code d'inscription *" value={formData.code_inscription} onChange={(v) => handleInputChange("code_inscription", v)} />
            </>}

            {/* Common Fields */}
            <InputField id="email" label="Email *" type="email" value={formData.email} onChange={(v) => handleInputChange("email", v)} />
            <InputField id="password" label="Mot de passe *" type="password" value={formData.password} onChange={(v) => handleInputChange("password", v)} />

            <Button type="submit" variant="hero" size="lg" className="w-full">S'inscrire</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Reusable small components
const InputField = ({ id, label, value, onChange, type = "text" }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} required />
  </div>
);

const SelectField = ({ id, label, options, value, onChange, loading }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner"} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt: any) => (
          <SelectItem key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default Register;
