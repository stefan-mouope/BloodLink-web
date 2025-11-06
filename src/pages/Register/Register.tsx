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
import { Heart, Mail, Lock, User, MapPin, Key, Building2, ArrowRight, Droplet } from "lucide-react";

type UserRole = "docteur" | "banque" | "donneur";
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Register = () => {
  const [role, setRole] = useState<UserRole>("donneur");
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      const payload: any = { email: formData.email, password: formData.password, user_type: role };
      if (role === "donneur") Object.assign(payload, { nom: formData.nom, prenom: formData.prenom, groupe_sanguin: formData.groupe_sanguin });
      if (role === "docteur") Object.assign(payload, { nom: formData.nom, prenom: formData.prenom, code_inscription: formData.code_inscription, BanqueDeSang: formData.BanqueDeSang ? Number(formData.BanqueDeSang) : undefined });
      if (role === "banque") Object.assign(payload, { nom: formData.nom, localisation: formData.localisation, code_inscription: formData.code_inscription });

      await AuthApi.register(payload);
      setFormData({ ...formData, password: "" });
      toast({ title: "✅ Inscription réussie !", description: "Veuillez vous connecter avec vos identifiants." });
      navigate("/login");
    } catch (err: any) {
      const description = err?.response?.data?.detail || err?.response?.data || "Une erreur est survenue";
      toast({ title: "❌ Erreur", description: String(description), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-rose-50 via-red-50 to-rose-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Side - Branding */}
      {/* <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative z-10">
        <div className="max-w-lg space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/40">
              <Heart className="w-9 h-9 text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">BloodLink</h1>
              <p className="text-slate-600">Rejoignez notre mission</p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/80">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Pourquoi nous rejoindre ?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Sauvez des vies</h3>
                  <p className="text-sm text-slate-600">Chaque don compte et peut sauver jusqu'à 3 vies</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Alertes en temps réel</h3>
                  <p className="text-sm text-slate-600">Soyez notifié instantanément des besoins urgents</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Plateforme sécurisée</h3>
                  <p className="text-sm text-slate-600">Vos informations sont protégées et confidentielles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <Card className="w-full max-w-xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-6 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/30">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-800">Inscription</CardTitle>
            <CardDescription className="text-base">Créez votre compte BloodLink</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-slate-700 font-medium text-base">Je suis :</Label>
                <RadioGroup value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${role === "docteur" ? "border-red-500 bg-red-50" : "border-slate-200 hover:border-red-300 bg-white"}`}>
                    <RadioGroupItem value="docteur" id="docteur" className="border-slate-300" />
                    <Label htmlFor="docteur" className="cursor-pointer flex-1 font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">👨‍⚕️</span>
                        <span>Docteur</span>
                      </div>
                    </Label>
                  </div>

                  <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${role === "banque" ? "border-red-500 bg-red-50" : "border-slate-200 hover:border-red-300 bg-white"}`}>
                    <RadioGroupItem value="banque" id="banque" className="border-slate-300" />
                    <Label htmlFor="banque" className="cursor-pointer flex-1 font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🏥</span>
                        <span>Banque de sang</span>
                      </div>
                    </Label>
                  </div>

                  <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${role === "donneur" ? "border-red-500 bg-red-50" : "border-slate-200 hover:border-red-300 bg-white"}`}>
                    <RadioGroupItem value="donneur" id="donneur" className="border-slate-300" />
                    <Label htmlFor="donneur" className="cursor-pointer flex-1 font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">❤️</span>
                        <span>Donneur</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Dynamic Fields */}
              {role === "donneur" && (
                <div className="space-y-4 animate-in fade-in-50 duration-500">
                  <InputFieldWithIcon id="nom" label="Nom" icon={User} value={formData.nom} onChange={(v) => handleInputChange("nom", v)} />
                  <InputFieldWithIcon id="prenom" label="Prénom" icon={User} value={formData.prenom} onChange={(v) => handleInputChange("prenom", v)} />
                  <SelectFieldWithIcon id="groupe_sanguin" label="Groupe sanguin" icon={Droplet} options={bloodTypes} value={formData.groupe_sanguin} onChange={(v) => handleInputChange("groupe_sanguin", v)} />
                </div>
              )}

              {role === "docteur" && (
                <div className="space-y-4 animate-in fade-in-50 duration-500">
                  <InputFieldWithIcon id="nom" label="Nom" icon={User} value={formData.nom} onChange={(v) => handleInputChange("nom", v)} />
                  <InputFieldWithIcon id="prenom" label="Prénom" icon={User} value={formData.prenom} onChange={(v) => handleInputChange("prenom", v)} />
                  <InputFieldWithIcon id="code_inscription" label="Code d'inscription" icon={Key} value={formData.code_inscription} onChange={(v) => handleInputChange("code_inscription", v)} />
                  <SelectFieldWithIcon id="BanqueDeSang" label="Banque de sang" icon={Building2} options={banks.map(b => ({ label: b.nom, value: String(b.id) }))} value={formData.BanqueDeSang} onChange={(v) => handleInputChange("BanqueDeSang", v)} loading={banksLoading} />
                </div>
              )}

              {role === "banque" && (
                <div className="space-y-4 animate-in fade-in-50 duration-500">
                  <InputFieldWithIcon id="nom" label="Nom de la banque" icon={Building2} value={formData.nom} onChange={(v) => handleInputChange("nom", v)} />
                  <InputFieldWithIcon id="localisation" label="Localisation" icon={MapPin} value={formData.localisation} onChange={(v) => handleInputChange("localisation", v)} />
                  <InputFieldWithIcon id="code_inscription" label="Code d'inscription" icon={Key} value={formData.code_inscription} onChange={(v) => handleInputChange("code_inscription", v)} />
                </div>
              )}

              {/* Common Fields */}
              <div className="space-y-4 pt-2">
                <InputFieldWithIcon id="email" label="Email" icon={Mail} type="email" value={formData.email} onChange={(v) => handleInputChange("email", v)} />
                <InputFieldWithIcon id="password" label="Mot de passe" icon={Lock} type="password" value={formData.password} onChange={(v) => handleInputChange("password", v)} />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold shadow-lg shadow-red-500/30 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Inscription...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Créer mon compte
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Déjà inscrit ?</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/login")}
                className="w-full h-12 border-2 border-slate-200 hover:border-red-500 hover:bg-red-50 hover:text-red-600 font-semibold transition-all duration-200"
              >
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Reusable Components
const InputFieldWithIcon = ({ id, label, value, onChange, type = "text", icon: Icon }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-slate-700 font-medium">{label} *</Label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <Input 
        id={id} 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="pl-11 h-12 border-slate-200 focus:border-red-500 focus:ring-red-500"
        required 
      />
    </div>
  </div>
);

const SelectFieldWithIcon = ({ id, label, options, value, onChange, loading, icon: Icon }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-slate-700 font-medium">{label} *</Label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10 pointer-events-none" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="pl-11 h-12 border-slate-200 focus:border-red-500 focus:ring-red-500">
          <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt: any) => (
            <SelectItem key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

export default Register;