import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Instagram, Linkedin, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConnectAccountsFormProps {
  onConnect: () => void;
}

export function ConnectAccountsForm({ onConnect }: ConnectAccountsFormProps) {
  const [accounts, setAccounts] = useState({
    facebook: "",
    instagram: "",
    linkedin: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Accounts connected successfully!",
      description: "Your social media accounts have been linked to the dashboard.",
    });

    setIsLoading(false);
    onConnect();
  };

  const handleInputChange = (platform: keyof typeof accounts, value: string) => {
    setAccounts(prev => ({ ...prev, [platform]: value }));
  };

  const isFormValid = accounts.facebook && accounts.instagram && accounts.linkedin;

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-card border-0">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-semibold text-notion-gray-900">
            Connect Your Social Accounts
          </CardTitle>
          <CardDescription className="text-lg text-notion-gray-500">
            Link your social media accounts to start tracking your analytics
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Facebook */}
            <div className="space-y-3">
              <Label htmlFor="facebook" className="flex items-center gap-2 text-notion-gray-700 font-medium">
                <Facebook className="h-5 w-5 text-blue-600" />
                Facebook Page
              </Label>
              <Input
                id="facebook"
                type="text"
                placeholder="Enter your Facebook page URL or ID"
                value={accounts.facebook}
                onChange={(e) => handleInputChange("facebook", e.target.value)}
                className="h-12 border-notion-gray-200 focus:border-primary"
                required
              />
            </div>

            {/* Instagram */}
            <div className="space-y-3">
              <Label htmlFor="instagram" className="flex items-center gap-2 text-notion-gray-700 font-medium">
                <Instagram className="h-5 w-5 text-pink-600" />
                Instagram Business Account
              </Label>
              <Input
                id="instagram"
                type="text"
                placeholder="Enter your Instagram username"
                value={accounts.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                className="h-12 border-notion-gray-200 focus:border-primary"
                required
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-3">
              <Label htmlFor="linkedin" className="flex items-center gap-2 text-notion-gray-700 font-medium">
                <Linkedin className="h-5 w-5 text-blue-700" />
                LinkedIn Company Page
              </Label>
              <Input
                id="linkedin"
                type="text"
                placeholder="Enter your LinkedIn company page URL"
                value={accounts.linkedin}
                onChange={(e) => handleInputChange("linkedin", e.target.value)}
                className="h-12 border-notion-gray-200 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting Accounts...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Connect Accounts
                  </div>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base font-medium"
                onClick={onConnect}
                disabled={isLoading}
              >
                Try Demo Dashboard
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}