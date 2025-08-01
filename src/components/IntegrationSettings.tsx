import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Instagram, Linkedin, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface IntegrationSettingsProps {
  portfolioId: string;
  onBack: () => void;
}

export function IntegrationSettings({ portfolioId, onBack }: IntegrationSettingsProps) {
  const [integrations, setIntegrations] = useState({
    instagram: { connected: false, accessToken: "", accountId: "" },
    linkedin: { connected: false, accessToken: "", organizationId: "" }
  });

  const handleConnect = async (platform: 'instagram' | 'linkedin') => {
    // In a real implementation, this would redirect to OAuth flow
    toast.success(`Redirecting to ${platform === 'instagram' ? 'Meta' : 'LinkedIn'} OAuth...`);
    
    // Simulate OAuth connection
    setTimeout(() => {
      setIntegrations(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          connected: true,
          accessToken: `mock_token_${Date.now()}`,
          accountId: platform === 'instagram' ? 'ig_account_123' : 'li_org_456'
        }
      }));
      toast.success(`${platform === 'instagram' ? 'Instagram' : 'LinkedIn'} connected successfully!`);
    }, 2000);
  };

  const handleDisconnect = (platform: 'instagram' | 'linkedin') => {
    setIntegrations(prev => ({
      ...prev,
      [platform]: { connected: false, accessToken: "", accountId: "" }
    }));
    toast.success(`${platform === 'instagram' ? 'Instagram' : 'LinkedIn'} disconnected`);
  };

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
            Back to Portfolio
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-notion-text">Integration Settings</h1>
            <p className="text-sm text-notion-text-secondary">Manage your social media API connections</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Instagram Integration */}
          <Card className="border-notion-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Instagram className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-notion-text">Instagram Business</CardTitle>
                  <p className="text-sm text-notion-text-secondary">
                    Connect your Instagram Business account via Meta API
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge variant={integrations.instagram.connected ? "default" : "secondary"}>
                    {integrations.instagram.connected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.instagram.connected ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-notion-text-secondary">Account ID</Label>
                    <Input 
                      value={integrations.instagram.accountId} 
                      readOnly 
                      className="bg-notion-bg/50"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleDisconnect('instagram')}
                      className="border-notion-border"
                    >
                      Disconnect
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open('https://developers.facebook.com/docs/instagram-api', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      API Docs
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-notion-text-secondary mb-3">
                    Connect your Instagram Business account to access metrics like reach, impressions, and engagement.
                  </p>
                  <Button onClick={() => handleConnect('instagram')}>
                    Connect Instagram
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* LinkedIn Integration */}
          <Card className="border-notion-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Linkedin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-notion-text">LinkedIn Company Page</CardTitle>
                  <p className="text-sm text-notion-text-secondary">
                    Connect your LinkedIn Company Page for analytics
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge variant={integrations.linkedin.connected ? "default" : "secondary"}>
                    {integrations.linkedin.connected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.linkedin.connected ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-notion-text-secondary">Organization ID</Label>
                    <Input 
                      value={integrations.linkedin.organizationId} 
                      readOnly 
                      className="bg-notion-bg/50"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleDisconnect('linkedin')}
                      className="border-notion-border"
                    >
                      Disconnect
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open('https://docs.microsoft.com/en-us/linkedin/', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      API Docs
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-notion-text-secondary mb-3">
                    Connect your LinkedIn Company Page to access impressions, reactions, and follower growth data.
                  </p>
                  <Button onClick={() => handleConnect('linkedin')}>
                    Connect LinkedIn
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          <Card className="border-notion-border bg-notion-accent/5">
            <CardHeader>
              <CardTitle className="text-notion-text">Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-notion-text-secondary">
              <div>
                <strong className="text-notion-text">Instagram:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Requires Instagram Business or Creator account</li>
                  <li>Must be connected to a Facebook Page</li>
                  <li>App needs review for production use</li>
                </ul>
              </div>
              <div>
                <strong className="text-notion-text">LinkedIn:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Requires LinkedIn Company Page admin access</li>
                  <li>Need to create LinkedIn Developer Application</li>
                  <li>Requires approval for analytics permissions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}