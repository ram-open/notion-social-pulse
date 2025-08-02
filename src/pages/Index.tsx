import { useState, useEffect } from "react";
import { ConnectAccountsForm } from "@/components/ConnectAccountsForm";
import { PortfolioList } from "@/components/PortfolioList";
import { PortfolioDetail } from "@/components/PortfolioDetail";
import { AuthForm } from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";

type ViewState = "auth" | "connect" | "portfolios" | "portfolio-detail";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewState>("auth");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is already authenticated
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        setCurrentView("portfolios");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentView("portfolios");
      } else {
        setUser(null);
        setCurrentView("auth");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = () => {
    setCurrentView("portfolios");
  };

  const handleConnect = () => {
    setCurrentView("portfolios");
  };

  const handleSelectPortfolio = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
    setCurrentView("portfolio-detail");
  };

  const handleBackToPortfolios = () => {
    setCurrentView("portfolios");
    setSelectedPortfolioId(null);
  };

  const handleCreatePortfolio = () => {
    // TODO: Implement portfolio creation
    console.log("Create new portfolio");
  };

  const handleManageIntegrations = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
    setCurrentView("portfolio-detail");
  };

  if (currentView === "portfolio-detail" && selectedPortfolioId) {
    return (
      <PortfolioDetail 
        portfolioId={selectedPortfolioId}
        onBack={handleBackToPortfolios}
      />
    );
  }

  if (currentView === "portfolios") {
    return (
      <PortfolioList 
        onSelectPortfolio={handleSelectPortfolio}
        onCreatePortfolio={handleCreatePortfolio}
        onManageIntegrations={handleManageIntegrations}
      />
    );
  }

  if (currentView === "connect") {
    return <ConnectAccountsForm onConnect={handleConnect} />;
  }

  return <AuthForm onAuth={handleAuth} />;
};

export default Index;
