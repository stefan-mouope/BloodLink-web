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

type UserRole = "doctor" | "blood_bank" | "donor";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>("donor");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    hospital: "",
    bankName: "",
    location: "",
    bloodType: "",
    phone: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store user data in localStorage for demo
    localStorage.setItem("userRole", role);
    localStorage.setItem("userData", JSON.stringify(formData));
    localStorage.setItem("isAuthenticated", "true");

    toast({
      title: isLogin ? "Connexion réussie !" : "Inscription réussie !",
      description: `Bienvenue ${formData.fullName || formData.bankName}`,
    });

    navigate("/dashboard");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex flex-col lg:flex-row">
      {/* Left Side - Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-2/5 lg:flex-col lg:items-center lg:justify-center lg:p-12 lg:bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative z-10 text-white text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-12 h-12 text-white fill-current" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Bienvenue sur BloodLink</h1>
            <p className="text-lg text-white/90">Connectez-vous pour sauver des vies</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0 p-6 lg:p-12">
        {/* Header */}
        <div className="mb-6 lg:mb-8 flex items-center justify-between max-w-2xl mx-auto w-full">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Retour</span>
          </button>
          
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-bold text-primary">BloodLink</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl animate-slide-up">
            <Card className="shadow-lg border-2">
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-2xl lg:text-3xl text-center">
                  {isLogin ? "Connexion" : "Inscription"}
                </CardTitle>
                <CardDescription className="text-center text-base">
                  {isLogin ? "Connectez-vous à votre compte" : "Créez votre compte BloodLink"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Role Selection */}
                  <div className="space-y-3">
                    <Label className="text-base">Je suis :</Label>
                    <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-smooth cursor-pointer">
                          <RadioGroupItem value="doctor" id="doctor" />
                          <Label htmlFor="doctor" className="cursor-pointer flex-1 font-normal text-base">
                            👨‍⚕️ Docteur
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-smooth cursor-pointer">
                          <RadioGroupItem value="blood_bank" id="blood_bank" />
                          <Label htmlFor="blood_bank" className="cursor-pointer flex-1 font-normal text-base">
                            🏥 Banque
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-smooth cursor-pointer">
                          <RadioGroupItem value="donor" id="donor" />
                          <Label htmlFor="donor" className="cursor-pointer flex-1 font-normal text-base">
                            ❤️ Donneur
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Dynamic Fields based on Role */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {role === "doctor" && (
                        <>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="fullName">Nom complet *</Label>
                            <Input
                              id="fullName"
                              type="text"
                              placeholder="Dr. Jean Dupont"
                              value={formData.fullName}
                              onChange={(e) => handleInputChange("fullName", e.target.value)}
                              required
                              className="h-12"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="hospital">Hôpital *</Label>
                            <Input
                              id="hospital"
                              type="text"
                              placeholder="Hôpital Central"
                              value={formData.hospital}
                              onChange={(e) => handleInputChange("hospital", e.target.value)}
                              required
                              className="h-12"
                            />
                          </div>
                        </>
                      )}

                      {role === "blood_bank" && (
                        <>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="bankName">Nom de la banque *</Label>
                            <Input
                              id="bankName"
                              type="text"
                              placeholder="Banque de Sang Nationale"
                              value={formData.bankName}
                              onChange={(e) => handleInputChange("bankName", e.target.value)}
                              required
                              className="h-12"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="location">Localisation *</Label>
                            <Input
                              id="location"
                              type="text"
                              placeholder="Paris, France"
                              value={formData.location}
                              onChange={(e) => handleInputChange("location", e.target.value)}
                              required
                              className="h-12"
                            />
                          </div>
                        </>
                      )}

                      {role === "donor" && (
                        <>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="fullName">Nom complet *</Label>
                            <Input
                              id="fullName"
                              type="text"
                              placeholder="Marie Martin"
                              value={formData.fullName}
                              onChange={(e) => handleInputChange("fullName", e.target.value)}
                              required
                              className="h-12"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bloodType">Groupe sanguin *</Label>
                            <Select value={formData.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
                              <SelectTrigger className="h-12">
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
                          <div className="space-y-2">
                            <Label htmlFor="phone">Téléphone *</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+33 6 12 34 56 78"
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              required
                              className="h-12"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Common Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@exemple.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="password">Mot de passe *</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          required
                          className="h-12"
                        />
                      </div>
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
      </div>
    </div>
  );
};

export default Auth;
