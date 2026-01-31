import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Solucoes from "./pages/Solucoes";
import Portfolio from "./pages/Portfolio";
import Depoimentos from "./pages/Depoimentos";
import Ferramentas from "./pages/Ferramentas";
import VideoInstitucional from "./pages/VideoInstitucional";
import LinksUteis from "./pages/LinksUteis";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminSetup from "./pages/admin/AdminSetup";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminServices from "./pages/admin/AdminServices";
import AdminClients from "./pages/admin/AdminClients";
import AdminLinks from "./pages/admin/AdminLinks";
import AdminFaq from "./pages/admin/AdminFaq";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="avaliacoes" element={<AdminTestimonials />} />
            <Route path="produtos" element={<AdminProducts />} />
            <Route path="servicos" element={<AdminServices />} />
            <Route path="clientes" element={<AdminClients />} />
            <Route path="links" element={<AdminLinks />} />
            <Route path="faq" element={<AdminFaq />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
