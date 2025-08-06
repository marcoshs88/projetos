import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Upload from "./pages/Upload";
import Finance from "./pages/Finance";
import Monitors from "./pages/Monitors";
import Locations from "./pages/Locations";
import CalendarPage from "./pages/CalendarPage"; // Importando a nova página
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/eventos" element={<Events />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/financeiro" element={<Finance />} />
            <Route path="/monitores" element={<Monitors />} />
            <Route path="/locais" element={<Locations />} />
            <Route path="/calendario" element={<CalendarPage />} /> {/* Nova rota */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;