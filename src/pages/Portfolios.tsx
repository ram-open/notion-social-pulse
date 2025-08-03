import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PortfolioList } from "@/components/PortfolioList";
import { CreatePortfolioModal } from "@/components/CreatePortfolioModal";

const Portfolios = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSelectPortfolio = (portfolioId: string) => {
    navigate(`/portfolio/${portfolioId}`);
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
    navigate(`/portfolio/${portfolioId}`);
  };

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
};

export default Portfolios;