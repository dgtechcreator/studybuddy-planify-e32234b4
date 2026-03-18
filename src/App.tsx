import { Toaster } from "sonner";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <AuthWrapper>
              <Index />
            </AuthWrapper>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
