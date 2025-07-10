
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Solucoes from "./pages/Solucoes";
import Juridico from "./pages/Juridico";
import Portfolio from "./pages/Portfolio";
import Depoimentos from "./pages/Depoimentos";
import Ferramentas from "./pages/Ferramentas";
import VideoInstitucional from "./pages/VideoInstitucional";
import NotFound from "./pages/NotFound";

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
          <Route path="/juridico" element={<Juridico />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/depoimentos" element={<Depoimentos />} />
          <Route path="/ferramentas" element={<Ferramentas />} />
          <Route path="/video-institucional" element={<VideoInstitucional />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
