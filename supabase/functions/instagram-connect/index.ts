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

    const metaAppId = Deno.env.get('META_APP_ID')
    const metaAppSecret = Deno.env.get('META_APP_SECRET')

    if (!metaAppId || !metaAppSecret) {
      throw new Error('Meta credentials not configured')
    }

    const { action, portfolioId, code, redirectUri } = await req.json()

    if (action === 'get-auth-url') {
      // Generate Instagram OAuth URL
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${metaAppId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code`
      
      return new Response(
        JSON.stringify({ success: true, authUrl }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (action === 'connect') {
      if (!code) {
        throw new Error('Authorization code is required')
      }

      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: metaAppId,
          client_secret: metaAppSecret,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code: code,
        }),
      })

      const tokenData = await tokenResponse.json()

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error_description || 'Failed to exchange code for token')
      }

      // Get user info using the access token
      const userResponse = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${tokenData.access_token}`)
      const userData = await userResponse.json()

      if (!userResponse.ok) {
        throw new Error(userData.error?.message || 'Failed to get user info')
      }

      // Get follower count using the long-lived token
      const followerResponse = await fetch(`https://graph.instagram.com/${userData.id}?fields=followers_count,media_count&access_token=${tokenData.access_token}`)
      const followerData = await followerResponse.json()

      // Update portfolio platform connection
      const { error: updateError } = await supabaseClient
        .from('portfolio_platforms')
        .upsert({
          portfolio_id: portfolioId,
          platform_id: 'instagram',
          is_connected: true,
          followers: followerData.followers_count || 0,
        })

      if (updateError) throw updateError

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            username: userData.username,
            followers: followerData.followers_count || 0,
            media_count: followerData.media_count || 0
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