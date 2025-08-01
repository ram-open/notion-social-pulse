import { useState } from "react";
import { ConnectAccountsForm } from "@/components/ConnectAccountsForm";
import { PortfolioList } from "@/components/PortfolioList";
import { PortfolioDetail } from "@/components/PortfolioDetail";

type ViewState = "connect" | "portfolios" | "portfolio-detail";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewState>("connect");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);

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

  return <ConnectAccountsForm onConnect={handleConnect} />;
};

export default Index;
