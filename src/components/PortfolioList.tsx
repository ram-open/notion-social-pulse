import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Users, TrendingUp, Settings, LogOut } from "lucide-react";
import { PortfolioManagementModal } from "./PortfolioManagementModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Portfolio {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  totalFollowers: number;
  engagementRate: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface PortfolioListProps {
  onSelectPortfolio: (portfolioId: string) => void;
  onCreatePortfolio: () => void;
  onManageIntegrations: (portfolioId: string) => void;
}

export function PortfolioList({ onSelectPortfolio, onCreatePortfolio, onManageIntegrations }: PortfolioListProps) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          portfolio_platforms (
            platform_id,
            followers,
            is_connected,
            platforms (name)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedPortfolios: Portfolio[] = data.map(portfolio => ({
        id: portfolio.id,
        name: portfolio.name,
        description: portfolio.description || '',
        platforms: portfolio.portfolio_platforms?.map((pp: any) => pp.platforms.name) || [],
        totalFollowers: portfolio.total_followers || 0,
        engagementRate: Number(portfolio.engagement_rate) || 0,
        user_id: portfolio.user_id,
        created_at: portfolio.created_at,
        updated_at: portfolio.updated_at
      }));

      setPortfolios(formattedPortfolios);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPortfolio = (portfolio: Portfolio, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPortfolio(portfolio);
    setIsModalOpen(true);
  };

  const handleSavePortfolio = async (updatedPortfolio: Portfolio) => {
    try {
      const { error } = await supabase
        .from('portfolios')
        .update({
          name: updatedPortfolio.name,
          description: updatedPortfolio.description
        })
        .eq('id', updatedPortfolio.id);

      if (error) throw error;

      setPortfolios(portfolios.map(p => 
        p.id === updatedPortfolio.id ? updatedPortfolio : p
      ));

      toast({
        title: "Success",
        description: "Portfolio updated successfully"
      });
    } catch (error) {
      console.error('Error updating portfolio:', error);
      toast({
        title: "Error",
        description: "Failed to update portfolio",
        variant: "destructive"
      });
    }
  };

  const handleDeletePortfolio = async (portfolioId: string) => {
    try {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', portfolioId);

      if (error) throw error;

      setPortfolios(portfolios.filter(p => p.id !== portfolioId));
      
      toast({
        title: "Success",
        description: "Portfolio deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Logged out successfully"
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };
  return (
    <div className="min-h-screen bg-notion-bg p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-notion-text mb-2">Portfolios</h1>
            <p className="text-notion-text-secondary">Manage your brand social media portfolios</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={onCreatePortfolio} className="h-11 px-6">
              <Plus className="h-4 w-4 mr-2" />
              New Portfolio
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="h-11 px-6"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-notion-text-secondary">Loading portfolios...</p>
          </div>
        ) : portfolios.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-notion-text-secondary">No portfolios found. Create your first portfolio to get started.</p>
          </div>
        ) : (
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
        )}

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