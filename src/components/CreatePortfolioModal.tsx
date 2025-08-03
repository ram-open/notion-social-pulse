import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Instagram, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePortfolioModal({ isOpen, onClose, onSuccess }: CreatePortfolioModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const socialPlatforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-600", available: true },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-700", available: true },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600", available: false },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "text-blue-400", available: false },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-600", available: false }
  ];

  const handleClose = () => {
    setStep(1);
    setName("");
    setDescription("");
    onClose();
  };

  const handleNext = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Portfolio name is required",
        variant: "destructive"
      });
      return;
    }
    setStep(2);
  };

  const handleCreatePortfolio = async (connectLater = false) => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Portfolio name is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from('portfolios')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          user_id: user.id,
          total_followers: 0,
          engagement_rate: 0.0
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Portfolio "${name}" created successfully!`
      });

      handleClose();
      onSuccess();
    } catch (error: any) {
      console.error('Error creating portfolio:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create portfolio",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectPlatform = async (platform: any) => {
    if (!platform.available) {
      toast({
        title: "Coming Soon",
        description: `${platform.name} connection will be available soon!`,
      });
      return;
    }

    if (platform.id === "instagram") {
      // Redirect to Instagram OAuth
      window.open(`https://api.instagram.com/oauth/authorize?client_id=YOUR_INSTAGRAM_CLIENT_ID&redirect_uri=${encodeURIComponent(window.location.origin)}&scope=user_profile,user_media&response_type=code`, '_blank');
    } else if (platform.id === "linkedin") {
      // Redirect to LinkedIn OAuth
      window.open(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_LINKEDIN_CLIENT_ID&redirect_uri=${encodeURIComponent(window.location.origin)}&scope=profile%20email`, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Create New Portfolio" : "Connect Social Accounts"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="portfolio-name">Portfolio Name *</Label>
              <Input
                id="portfolio-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter portfolio name"
                maxLength={100}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="portfolio-description">Description</Label>
              <Textarea
                id="portfolio-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter portfolio description (optional)"
                rows={3}
                maxLength={500}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-4">
            <p className="text-sm text-notion-text-secondary mb-4">
              Connect your social media accounts to start tracking analytics for "{name}".
            </p>
            
            <div className="grid gap-3">
              {socialPlatforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <Card key={platform.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className={`h-6 w-6 ${platform.color}`} />
                          <span className="font-medium">{platform.name}</span>
                        </div>
                        <Button 
                          variant={platform.available ? "outline" : "secondary"} 
                          size="sm"
                          onClick={() => handleConnectPlatform(platform)}
                          disabled={!platform.available}
                        >
                          {platform.available ? "Connect" : "Coming Soon"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-notion-accent/5 rounded-lg">
              <p className="text-sm text-notion-text-secondary">
                You can connect accounts later from the portfolio settings.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {step === 2 && (
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            {step === 1 && (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </>
            )}
            
            {step === 2 && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => handleCreatePortfolio(true)}
                  disabled={loading}
                >
                  Do this later
                </Button>
                <Button 
                  onClick={() => handleCreatePortfolio(false)}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Portfolio"}
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}