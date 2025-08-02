import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Instagram, Facebook, Linkedin, Settings } from "lucide-react";
import { Dashboard } from "./Dashboard";
import { AccountAnalytics } from "./AccountAnalytics";
import { IntegrationSettings } from "./IntegrationSettings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Portfolio {
  id: string;
  name: string;
  description: string;
  user_id: string;
  total_followers: number;
  engagement_rate: number;
  created_at: string;
  updated_at: string;
}

interface Platform {
  id: string;
  name: string;
  icon: any;
  followers: string;
  connected: boolean;
}

interface PortfolioDetailProps {
  portfolioId: string;
  onBack: () => void;
}

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
};

export function PortfolioDetail({ portfolioId, onBack }: PortfolioDetailProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPortfolioData();
  }, [portfolioId]);

  const fetchPortfolioData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "User not authenticated",
          variant: "destructive"
        });
        return;
      }

      // Fetch portfolio data
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', portfolioId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (portfolioError) throw portfolioError;
      
      if (!portfolioData) {
        setPortfolio(null);
        setLoading(false);
        return;
      }

      setPortfolio(portfolioData);

      // Fetch platform connections
      const { data: portfolioPlatforms, error: platformError } = await supabase
        .from('portfolio_platforms')
        .select(`
          *,
          platforms (*)
        `)
        .eq('portfolio_id', portfolioId);

      if (platformError) throw platformError;

      // Format platforms data
      const formattedPlatforms: Platform[] = portfolioPlatforms?.map((pp: any) => ({
        id: pp.platform_id,
        name: pp.platforms.name,
        icon: platformIcons[pp.platform_id as keyof typeof platformIcons] || Instagram,
        followers: pp.followers ? (pp.followers > 1000 ? `${Math.round(pp.followers / 1000)}K` : pp.followers.toString()) : '0',
        connected: pp.is_connected || false
      })) || [];

      setPlatforms(formattedPlatforms);
    } catch (error: any) {
      console.error('Error fetching portfolio data:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-notion-bg flex items-center justify-center">
        <p className="text-notion-text-secondary">Loading portfolio...</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-notion-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-notion-text-secondary mb-4">Portfolio not found</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolios
          </Button>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <IntegrationSettings 
        portfolioId={portfolioId}
        onBack={() => setShowSettings(false)}
      />
    );
  }

  if (selectedPlatform) {
    return (
      <div className="min-h-screen bg-notion-bg">
        <div className="border-b border-notion-border bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 p-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedPlatform(null)}
              className="text-notion-text-secondary hover:text-notion-text"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Platforms
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-notion-text">{portfolio.name}</h1>
              <p className="text-sm text-notion-text-secondary capitalize">{selectedPlatform} Analytics</p>
            </div>
          </div>
        </div>
        <AccountAnalytics platform={selectedPlatform} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-notion-bg">
      <div className="border-b border-notion-border bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 p-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="text-notion-text-secondary hover:text-notion-text"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolios
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-notion-text">{portfolio.name}</h1>
            <p className="text-sm text-notion-text-secondary">{portfolio.description || 'No description'}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="text-notion-text-secondary hover:text-notion-text"
          >
            <Settings className="h-4 w-4 mr-2" />
            Integrations
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-notion-text mb-2">Select Platform</h2>
            <p className="text-notion-text-secondary">Choose a platform to view detailed analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-notion-text-secondary mb-4">No platforms connected</p>
                <Button onClick={() => setShowSettings(true)} variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Connect Platforms
                </Button>
              </div>
            ) : (
              platforms.map((platform) => {
              const IconComponent = platform.icon;
              const isDisabled = platform.id === 'facebook';
              
              return (
                <Card 
                  key={platform.id}
                  className={`transition-all duration-200 border-notion-border group ${
                    isDisabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer hover:shadow-notion-hover'
                  }`}
                  onClick={() => !isDisabled && setSelectedPlatform(platform.id)}
                >
                  <CardHeader className="text-center pb-3">
                    <div className={`mx-auto p-3 rounded-xl mb-3 transition-colors ${
                      isDisabled 
                        ? 'bg-gray-100' 
                        : 'bg-notion-accent/10 group-hover:bg-notion-accent/20'
                    }`}>
                      <IconComponent className={`h-8 w-8 ${
                        isDisabled ? 'text-gray-400' : 'text-notion-accent'
                      }`} />
                    </div>
                    <CardTitle className={`text-xl ${
                      isDisabled ? 'text-gray-400' : 'text-notion-text'
                    }`}>
                      {platform.name}
                    </CardTitle>
                    {isDisabled && (
                      <p className="text-sm text-gray-400 mt-1">In Development</p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="text-center space-y-3">
                    <div>
                      <p className={`text-2xl font-bold ${
                        isDisabled ? 'text-gray-400' : 'text-notion-text'
                      }`}>
                        {platform.followers}
                      </p>
                      <p className={`text-sm ${
                        isDisabled ? 'text-gray-400' : 'text-notion-text-secondary'
                      }`}>
                        Followers
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2">
                      <Badge 
                        variant={isDisabled ? "secondary" : (platform.connected ? "default" : "secondary")}
                        className="text-xs"
                      >
                        {isDisabled ? "Coming Soon" : (platform.connected ? "Connected" : "Not Connected")}
                      </Badge>
                      {platform.connected && !isDisabled && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-notion-text-secondary hover:text-notion-text"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSettings(true);
                          }}
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            }))}
          </div>
        </div>
      </div>
    </div>
  );
}