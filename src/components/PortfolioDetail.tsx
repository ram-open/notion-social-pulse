import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Instagram, Facebook, Linkedin, Settings } from "lucide-react";
import { Dashboard } from "./Dashboard";

interface PortfolioDetailProps {
  portfolioId: string;
  onBack: () => void;
}

const mockPortfolioData = {
  "1": {
    name: "TechCorp Brand",
    description: "Main corporate social media presence",
    platforms: [
      { id: "instagram", name: "Instagram", icon: Instagram, followers: "45K", connected: true },
      { id: "facebook", name: "Facebook", icon: Facebook, followers: "62K", connected: true },
      { id: "linkedin", name: "LinkedIn", icon: Linkedin, followers: "18K", connected: true },
    ],
  },
  "2": {
    name: "TechCorp Careers", 
    description: "Recruitment and company culture content",
    platforms: [
      { id: "linkedin", name: "LinkedIn", icon: Linkedin, followers: "32K", connected: true },
      { id: "instagram", name: "Instagram", icon: Instagram, followers: "13K", connected: true },
    ],
  },
  "3": {
    name: "TechCorp Products",
    description: "Product announcements and updates", 
    platforms: [
      { id: "instagram", name: "Instagram", icon: Instagram, followers: "67K", connected: true },
      { id: "facebook", name: "Facebook", icon: Facebook, followers: "22K", connected: true },
    ],
  },
};

export function PortfolioDetail({ portfolioId, onBack }: PortfolioDetailProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const portfolio = mockPortfolioData[portfolioId as keyof typeof mockPortfolioData];

  if (!portfolio) {
    return <div>Portfolio not found</div>;
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
        <Dashboard />
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
          <div>
            <h1 className="text-xl font-semibold text-notion-text">{portfolio.name}</h1>
            <p className="text-sm text-notion-text-secondary">{portfolio.description}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-notion-text mb-2">Select Platform</h2>
            <p className="text-notion-text-secondary">Choose a platform to view detailed analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.platforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <Card 
                  key={platform.id}
                  className="cursor-pointer hover:shadow-notion-hover transition-all duration-200 border-notion-border group"
                  onClick={() => setSelectedPlatform(platform.id)}
                >
                  <CardHeader className="text-center pb-3">
                    <div className="mx-auto p-3 bg-notion-accent/10 rounded-xl mb-3 group-hover:bg-notion-accent/20 transition-colors">
                      <IconComponent className="h-8 w-8 text-notion-accent" />
                    </div>
                    <CardTitle className="text-xl text-notion-text">{platform.name}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="text-center space-y-3">
                    <div>
                      <p className="text-2xl font-bold text-notion-text">{platform.followers}</p>
                      <p className="text-sm text-notion-text-secondary">Followers</p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2">
                      <Badge 
                        variant={platform.connected ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {platform.connected ? "Connected" : "Not Connected"}
                      </Badge>
                      {platform.connected && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-notion-text-secondary hover:text-notion-text"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle configure action here
                            console.log(`Configure ${platform.name} for ${portfolio.name}`);
                          }}
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}