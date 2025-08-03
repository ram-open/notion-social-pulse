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
      // Get LinkedIn API credentials from secrets
      const clientId = Deno.env.get('LINKEDIN_CLIENT_ID')
      const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET')

      if (!clientId || !clientSecret) {
        throw new Error('LinkedIn API credentials not configured')
      }

      // Validate LinkedIn access token and get user info
      const linkedinApiUrl = `https://api.linkedin.com/v2/people/~?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`
      
      const response = await fetch(linkedinApiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      const linkedinData = await response.json()

      if (!response.ok) {
        throw new Error(linkedinData.message || 'Failed to validate LinkedIn token')
      }

      // Get follower count (this might require additional permissions)
      let followers = 0
      try {
        const followersResponse = await fetch(`https://api.linkedin.com/v2/networkSizes/${linkedinData.id}?edgeType=CompanyFollowedByMember`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        if (followersResponse.ok) {
          const followersData = await followersResponse.json()
          followers = followersData.firstDegreeSize || 0
        }
      } catch (error) {
        console.log('Could not fetch follower count:', error)
      }

      // Update portfolio platform connection
      const { error: updateError } = await supabaseClient
        .from('portfolio_platforms')
        .upsert({
          portfolio_id: portfolioId,
          platform_id: 'linkedin',
          is_connected: true,
          followers: followers,
        })

      if (updateError) throw updateError

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            name: `${linkedinData.firstName?.localized?.en_US || ''} ${linkedinData.lastName?.localized?.en_US || ''}`.trim(),
            followers: followers,
            id: linkedinData.id
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    if (action === 'fetch-analytics') {
      // Fetch LinkedIn analytics data
      const { data: platformData } = await supabaseClient
        .from('portfolio_platforms')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .eq('platform_id', 'linkedin')
        .single()

      if (!platformData?.is_connected) {
        throw new Error('LinkedIn not connected')
      }

      // Here you would fetch real analytics data from LinkedIn API
      // For now, returning mock data
      const analyticsData = {
        followers: platformData.followers || 0,
        engagement_rate: 3.8,
        posts: 28,
        likes: 890,
        comments: 156,
        shares: 67
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