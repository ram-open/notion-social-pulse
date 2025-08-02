import { useState, useEffect } from "react";
import { ConnectAccountsForm } from "@/components/ConnectAccountsForm";
import { PortfolioList } from "@/components/PortfolioList";
import { PortfolioDetail } from "@/components/PortfolioDetail";
import { AuthForm } from "@/components/AuthForm";
import { CreatePortfolioModal } from "@/components/CreatePortfolioModal";
import { supabase } from "@/integrations/supabase/client";

type ViewState = "auth" | "connect" | "portfolios" | "portfolio-detail";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewState>("auth");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
    setShowCreateModal(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    // Force a re-render by changing the key or triggering a refresh
    window.location.reload();
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
      <>
        <PortfolioList 
          onSelectPortfolio={handleSelectPortfolio}
          onCreatePortfolio={handleCreatePortfolio}
          onManageIntegrations={handleManageIntegrations}
        />
        <CreatePortfolioModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      </>
    );
  }

  if (currentView === "connect") {
    return <ConnectAccountsForm onConnect={handleConnect} />;
  }

  return <AuthForm onAuth={handleAuth} />;
};

export default Index;
