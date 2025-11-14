import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateWish from "./pages/CreateWish";
import WaitingPage from "./pages/WaitingPage";
import BirthdayView from "./pages/BirthdayView";
import ExpiredPage from "./pages/ExpiredPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/bestwishes/home" element={<Home />} />
          <Route path="/bestwishes/create" element={<CreateWish />} />
          <Route path="/wish/:id" element={<WaitingPage />} />
          <Route path="/wish/:id/view" element={<BirthdayView />} />
          <Route path="/wish/:id/expired" element={<ExpiredPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
