import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth";
import Header from "@/components/ui/Header";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { toast } = useToast();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast({ title: "Connexion réussie !" });
      navigate("/dashboard");
    } catch (err: any) {
      const description = err?.response?.data?.detail || err?.response?.data || "Une erreur est survenue";
      toast({ title: "Erreur", description: String(description) });
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-background via-secondary to-background">
      <Header />

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg border-2">
          <CardHeader className="space-y-2 pb-6 text-center">
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>Connectez-vous à votre compte</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="email@exemple.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full">Se connecter</Button>

              <div className="text-center text-sm mt-2">
                <span className="text-muted-foreground">Pas encore de compte ?</span>
                <Button type="button" variant="link" onClick={() => navigate("/register")} className="ml-2">S'inscrire</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
