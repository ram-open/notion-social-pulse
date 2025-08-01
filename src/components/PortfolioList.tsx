import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Users, TrendingUp, Settings } from "lucide-react";
import { PortfolioManagementModal } from "./PortfolioManagementModal";

interface Portfolio {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  totalFollowers: number;
  engagementRate: number;
}

interface PortfolioListProps {
  onSelectPortfolio: (portfolioId: string) => void;
  onCreatePortfolio: () => void;
  onManageIntegrations: (portfolioId: string) => void;
}

const mockPortfolios: Portfolio[] = [
  {
    id: "1",
    name: "TechCorp Brand",
    description: "Main corporate social media presence",
    platforms: ["Instagram", "Facebook", "LinkedIn"],
    totalFollowers: 125000,
    engagementRate: 4.2,
  },
  {
    id: "2", 
    name: "TechCorp Careers",
    description: "Recruitment and company culture content",
    platforms: ["LinkedIn", "Instagram"],
    totalFollowers: 45000,
    engagementRate: 6.8,
  },
  {
    id: "3",
    name: "TechCorp Products",
    description: "Product announcements and updates",
    platforms: ["Instagram", "Facebook"],
    totalFollowers: 89000,
    engagementRate: 3.9,
  },
];

export function PortfolioList({ onSelectPortfolio, onCreatePortfolio, onManageIntegrations }: PortfolioListProps) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(mockPortfolios);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditPortfolio = (portfolio: Portfolio, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPortfolio(portfolio);
    setIsModalOpen(true);
  };

  const handleSavePortfolio = (updatedPortfolio: Portfolio) => {
    setPortfolios(portfolios.map(p => 
      p.id === updatedPortfolio.id ? updatedPortfolio : p
    ));
  };

  const handleDeletePortfolio = (portfolioId: string) => {
    setPortfolios(portfolios.filter(p => p.id !== portfolioId));
  };
  return (
    <div className="min-h-screen bg-notion-bg p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-notion-text mb-2">Portfolios</h1>
            <p className="text-notion-text-secondary">Manage your brand social media portfolios</p>
          </div>
          <Button onClick={onCreatePortfolio} className="h-11 px-6">
            <Plus className="h-4 w-4 mr-2" />
            New Portfolio
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <Card 
              key={portfolio.id}
              className="cursor-pointer hover:shadow-notion-hover transition-all duration-200 border-notion-border"
              onClick={() => onSelectPortfolio(portfolio.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-notion-accent/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-notion-accent" />
                  </div>
                  <CardTitle className="text-xl text-notion-text flex-1">{portfolio.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-notion-text-secondary hover:text-notion-text"
                    onClick={(e) => handleEditPortfolio(portfolio, e)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-notion-text-secondary">{portfolio.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {portfolio.platforms.map((platform) => (
                    <Badge key={platform} variant="secondary" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-notion-text-secondary" />
                    <div>
                      <p className="text-sm font-medium text-notion-text">
                        {portfolio.totalFollowers.toLocaleString()}
                      </p>
                      <p className="text-xs text-notion-text-secondary">Followers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-notion-text-secondary" />
                    <div>
                      <p className="text-sm font-medium text-notion-text">
                        {portfolio.engagementRate}%
                      </p>
                      <p className="text-xs text-notion-text-secondary">Engagement</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedPortfolio && (
          <PortfolioManagementModal
            portfolio={selectedPortfolio}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSavePortfolio}
            onDelete={handleDeletePortfolio}
            onManageIntegrations={onManageIntegrations}
          />
        )}
      </div>
    </div>
  );
}