import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth";
import { AuthApi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { BanksApi } from "@/services/api";

type UserRole = "docteur" | "banque" | "donneur";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>("donneur");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    // commun pour docteur / donneur / banque
    nom: "",
    prenom: "",
    // donneur
    groupe_sanguin: "",
    // docteur
    code_inscription: "",
    BanqueDeSang: "",
    // banque
    localisation: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        const payload: any = {
          email: formData.email,
          password: formData.password,
          user_type: role,
        };
        if (role === "donneur") {
          Object.assign(payload, {
            nom: formData.nom,
            prenom: formData.prenom,
            groupe_sanguin: formData.groupe_sanguin,
          });
        } else if (role === "docteur") {
          Object.assign(payload, {
            nom: formData.nom,
            prenom: formData.prenom,
            code_inscription: formData.code_inscription,
            BanqueDeSang: formData.BanqueDeSang ? Number(formData.BanqueDeSang) : undefined,
          });
        } else if (role === "banque") {
          Object.assign(payload, {
            nom: formData.nom,
            localisation: formData.localisation,
            code_inscription: formData.code_inscription,
          });
        }
        // Registration should NOT log the user in automatically.
        // Call API directly, then switch to login form.
        await AuthApi.register(payload);
        setIsLogin(true);
        // Do not keep password after register
        setFormData((prev) => ({ ...prev, password: "" }));
        toast({ title: "Inscription réussie !", description: "Veuillez vous connecter avec vos identifiants." });
        return; // do not navigate here
      }

      toast({
        title: isLogin ? "Connexion réussie !" : "Inscription réussie !",
      });
      navigate("/dashboard");
    } catch (err: any) {
      const description = err?.response?.data?.detail || err?.response?.data || "Une erreur est survenue";
      toast({ title: "Erreur", description: String(description) });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Fetch banks when role is docteur
  const { data: banks = [], isLoading: banksLoading } = useQuery({
    queryKey: ["banks"],
    enabled: role === "docteur",
    queryFn: () => BanksApi.list(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth">
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="font-bold text-primary">BloodLink</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-md mx-auto animate-slide-up">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isLogin ? "Connexion" : "Inscription"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin ? "Connectez-vous à votre compte" : "Créez votre compte BloodLink"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label>Je suis :</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border-2 border-border hover:border-primary transition-smooth cursor-pointer">
                    <RadioGroupItem value="docteur" id="docteur" />
                    <Label htmlFor="docteur" className="cursor-pointer flex-1 font-normal">
                      👨‍⚕️ Docteur
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border-2 border-border hover:border-primary transition-smooth cursor-pointer">
                    <RadioGroupItem value="banque" id="banque" />
                    <Label htmlFor="banque" className="cursor-pointer flex-1 font-normal">
                      🏥 Banque de sang
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border-2 border-border hover:border-primary transition-smooth cursor-pointer">
                    <RadioGroupItem value="donneur" id="donneur" />
                    <Label htmlFor="donneur" className="cursor-pointer flex-1 font-normal">
                      ❤️ Donneur
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Dynamic Fields based on Role */}
              <div className="space-y-4">
                {role === "docteur" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom *</Label>
                      <Input id="nom" type="text" placeholder="Dupont" value={formData.nom} onChange={(e) => handleInputChange("nom", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input id="prenom" type="text" placeholder="Jean" value={formData.prenom} onChange={(e) => handleInputChange("prenom", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code_inscription">Code d'inscription (finit par DOC) *</Label>
                      <Input id="code_inscription" type="text" placeholder="XXXX-DOC" value={formData.code_inscription} onChange={(e) => handleInputChange("code_inscription", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="BanqueDeSang">Banque de sang *</Label>
                      <Select
                        value={formData.BanqueDeSang}
                        onValueChange={(val) => handleInputChange("BanqueDeSang", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={banksLoading ? "Chargement..." : "Sélectionner"} />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((b: any) => (
                            <SelectItem key={b.id} value={String(b.id)}>
                              {b.nom} {b.localisation ? `— ${b.localisation}` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {role === "banque" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom de la banque *</Label>
                      <Input id="nom" type="text" placeholder="Banque de Sang Nationale" value={formData.nom} onChange={(e) => handleInputChange("nom", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="localisation">Localisation *</Label>
                      <Input id="localisation" type="text" placeholder="Paris, France" value={formData.localisation} onChange={(e) => handleInputChange("localisation", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code_inscription">Code d'inscription (finit par BANC) *</Label>
                      <Input id="code_inscription" type="text" placeholder="XXXX-BANC" value={formData.code_inscription} onChange={(e) => handleInputChange("code_inscription", e.target.value)} required />
                    </div>
                  </>
                )}

                {role === "donneur" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom *</Label>
                      <Input id="nom" type="text" placeholder="Martin" value={formData.nom} onChange={(e) => handleInputChange("nom", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input id="prenom" type="text" placeholder="Marie" value={formData.prenom} onChange={(e) => handleInputChange("prenom", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="groupe_sanguin">Groupe sanguin *</Label>
                      <Select value={formData.groupe_sanguin} onValueChange={(value) => handleInputChange("groupe_sanguin", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Common Fields */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="email@exemple.com" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} required />
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" variant="hero" size="lg" className="w-full">
                {isLogin ? "Se connecter" : "S'inscrire"}
              </Button>

              {/* Toggle Login/Signup */}
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                </span>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2"
                >
                  {isLogin ? "S'inscrire" : "Se connecter"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
