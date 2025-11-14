// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateWish from "./pages/CreateWish";
import WaitingPage from "./pages/WaitingPage";
import BirthdayView from "./pages/BirthdayView";
import ExpiredPage from "./pages/ExpiredPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Authentication */}
              <Route path="/" element={<Login />} />
              
              {/* Protected User Routes */}
              <Route path="/bestwishes/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/bestwishes/create" element={
                <ProtectedRoute>
                  <CreateWish />
                </ProtectedRoute>
              } />
              
              {/* Legacy wish routes (for backwards compatibility) */}
              <Route path="/wish/:id" element={<WaitingPage />} />
              <Route path="/wish/:id/view" element={<BirthdayView />} />
              <Route path="/wish/:id/expired" element={<ExpiredPage />} />
              
              {/* Dynamic wish routes - Standard: /region/wish-name */}
              <Route path="/:region/:wishName" element={<BirthdayView />} />
              
              {/* Dynamic wish routes - VIP: /region/vip1-10/wish-name */}
              <Route path="/:region/:vipSlot/:wishName" element={<BirthdayView />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;