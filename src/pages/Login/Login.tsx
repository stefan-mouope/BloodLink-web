import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth";
import { Heart, Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      toast({ title: "✅ Connexion réussie !", description: "Bienvenue sur BloodLink" });
      navigate("/dashboard");
    } catch (err: any) {
      console.log(err.response.request.response)
      const description =err.response?.data.non_field_errors[0];
      toast({ title: "❌ Erreur", description: String(description), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-rose-50 via-red-50 to-rose-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative z-10">
        <div className="max-w-lg space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/40">
              <Heart className="w-9 h-9 text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">BloodLink</h1>
              <p className="text-slate-600">Sauvez des vies ensemble</p>
            </div>
          </div>
          
          <div className="space-y-6 text-slate-700">
            <div className="flex items-start gap-4 bg-white/60 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/80">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Don de sang simplifié</h3>
                <p className="text-sm text-slate-600">Connectez-vous et répondez aux alertes en temps réel</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/60 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/80">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Communauté solidaire</h3>
                <p className="text-sm text-slate-600">Rejoignez des milliers de donneurs engagés</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/60 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/80">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Sécurisé et fiable</h3>
                <p className="text-sm text-slate-600">Vos données sont protégées et confidentielles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-8 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/30">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-800">Connexion</CardTitle>
            <CardDescription className="text-base">Accédez à votre espace BloodLink</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    className="pl-11 h-12 border-slate-200 focus:border-red-500 focus:ring-red-500"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.password} 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                    className="pl-11 h-12 border-slate-200 focus:border-red-500 focus:ring-red-500"
                    required 
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold shadow-lg shadow-red-500/30 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connexion...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Se connecter
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Nouveau sur BloodLink ?</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/register")}
                className="w-full h-12 border-2 border-slate-200 hover:border-red-500 hover:bg-red-50 hover:text-red-600 font-semibold transition-all duration-200"
              >
                Créer un compte
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;