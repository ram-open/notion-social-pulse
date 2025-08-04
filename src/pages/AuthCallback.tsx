import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const platform = searchParams.get('platform') || 'instagram';
      const portfolioId = searchParams.get('portfolio_id');
      
      if (!code || !portfolioId) {
        toast({
          title: "Error",
          description: "Missing authorization code or portfolio ID",
          variant: "destructive"
        });
        navigate('/portfolios');
        return;
      }

      try {
        const redirectUri = window.location.origin + '/auth/callback';
        
        if (platform === 'instagram') {
          const { data, error } = await supabase.functions.invoke('instagram-connect', {
            body: { 
              action: 'connect', 
              portfolioId,
              code,
              redirectUri 
            }
          });

          if (error) throw error;
          if (!data.success) throw new Error(data.error || 'Failed to connect Instagram');

          toast({
            title: "Success!",
            description: `Instagram account connected: @${data.data.username}`
          });
        }
        
        // Close popup if opened from one, otherwise navigate back
        if (window.opener) {
          window.close();
        } else {
          navigate(`/portfolio/${portfolioId}/settings`);
        }
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast({
          title: "Connection Failed",
          description: error instanceof Error ? error.message : "Failed to connect account",
          variant: "destructive"
        });
        
        if (window.opener) {
          window.close();
        } else {
          navigate('/portfolios');
        }
      }
    };

    handleCallback();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-notion-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-notion-accent mx-auto mb-4"></div>
        <p className="text-notion-text-secondary">Connecting your account...</p>
      </div>
    </div>
  );
}