import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import DoctorPage from "./pages/DoctorPage/DoctorPage";
import RequetePage from "./pages/DoctorPage/RequetePage";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Donnor from "./pages/donnor/Donnor";
import BanquePage from "./pages/Bank/BanquePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path= element={<Auth />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/donnor" element={<Donnor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/doctor" element={<DoctorPage />} />
          <Route path="/requete" element={<RequetePage/>} />
          <Route path="/banque" element={<BanquePage/>} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
