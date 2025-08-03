import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the request
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const { action, portfolioId, accessToken } = await req.json()

    if (action === 'connect') {
      // Validate Instagram access token and get user info
      const instagramApiUrl = `https://graph.instagram.com/me?fields=id,username,followers_count,media_count&access_token=${accessToken}`
      
      const response = await fetch(instagramApiUrl)
      const instagramData = await response.json()

      if (!response.ok) {
        throw new Error(instagramData.error?.message || 'Failed to validate Instagram token')
      }

      // Update portfolio platform connection
      const { error: updateError } = await supabaseClient
        .from('portfolio_platforms')
        .upsert({
          portfolio_id: portfolioId,
          platform_id: 'instagram',
          is_connected: true,
          followers: instagramData.followers_count || 0,
        })

      if (updateError) throw updateError

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            username: instagramData.username,
            followers: instagramData.followers_count,
            media_count: instagramData.media_count
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (action === 'fetch-analytics') {
      // Fetch Instagram analytics data
      const { data: platformData } = await supabaseClient
        .from('portfolio_platforms')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .eq('platform_id', 'instagram')
        .single()

      if (!platformData?.is_connected) {
        throw new Error('Instagram not connected')
      }

      // Here you would fetch real analytics data from Instagram API
      // For now, returning mock data
      const analyticsData = {
        followers: platformData.followers || 0,
        engagement_rate: 4.2,
        posts: 45,
        likes: 1250,
        comments: 89,
        shares: 23
      }

      return new Response(
        JSON.stringify({ success: true, data: analyticsData }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    throw new Error('Invalid action')

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})