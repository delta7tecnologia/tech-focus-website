import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Solucoes from "./pages/Solucoes";
import Portfolio from "./pages/Portfolio";
import Depoimentos from "./pages/Depoimentos";
import Ferramentas from "./pages/Ferramentas";
import VideoInstitucional from "./pages/VideoInstitucional";
import LinksUteis from "./pages/LinksUteis";
import AreaTecnica from "./pages/AreaTecnica";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import SignReport from "./pages/SignReport";
import ValidateReport from "./pages/ValidateReport";
import ValidateServiceOrder from "./pages/ValidateServiceOrder";
import SignServiceOrder from "./pages/SignServiceOrder";
import SignProposal from "./pages/SignProposal";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminSetup from "./pages/admin/AdminSetup";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminServices from "./pages/admin/AdminServices";
import AdminClients from "./pages/admin/AdminClients";
import AdminLinks from "./pages/admin/AdminLinks";
import AdminTechnicians from "./pages/admin/AdminTechnicians";
import AdminFaq from "./pages/admin/AdminFaq";
import AdminAssets from "./pages/admin/AdminAssets";
import AdminFiles from "./pages/admin/AdminFiles";
import AdminReports from "./pages/admin/AdminReports";
import AdminServiceOrders from "./pages/admin/AdminServiceOrders";
import AdminProposals from "./pages/admin/AdminProposals";
import ValidateProposal from "./pages/ValidateProposal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/solucoes" element={<Solucoes />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/depoimentos" element={<Depoimentos />} />
            <Route path="/ferramentas" element={<Ferramentas />} />
            <Route path="/video-institucional" element={<VideoInstitucional />} />
            <Route path="/links-uteis" element={<LinksUteis />} />
            <Route path="/area-tecnica" element={<AreaTecnica />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/assinar/:token" element={<SignReport />} />
            <Route path="/assinar-os/:token" element={<SignServiceOrder />} />
            <Route path="/assinar-proposta/:token" element={<SignProposal />} />
            <Route path="/validar-laudo/:hash" element={<ValidateReport />} />
            <Route path="/validar-os/:hash" element={<ValidateServiceOrder />} />
            <Route path="/validar-proposta/:hash" element={<ValidateProposal />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/setup" element={<AdminSetup />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="avaliacoes" element={<AdminTestimonials />} />
              <Route path="servicos" element={<AdminServices />} />
              <Route path="clientes" element={<AdminClients />} />
              <Route path="links" element={<AdminLinks />} />
              <Route path="tecnicos" element={<AdminTechnicians />} />
              <Route path="faq" element={<AdminFaq />} />
              <Route path="patrimonios" element={<AdminAssets />} />
              <Route path="arquivos" element={<AdminFiles />} />
              <Route path="laudos" element={<AdminReports />} />
              <Route path="ordens-servico" element={<AdminServiceOrders />} />
              <Route path="propostas" element={<AdminProposals />} />
              <Route path="configuracoes" element={<AdminSettings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
