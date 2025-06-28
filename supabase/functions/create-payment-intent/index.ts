
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'npm:stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  console.log('=== CREATE PAYMENT INTENT FUNCTION STARTED ===')
  console.log('Method:', req.method)
  console.log('URL:', req.url)

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Checking environment variables...')
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY is not set')
      return new Response(
        JSON.stringify({ error: 'Stripe secret key not configured' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }
    console.log('Stripe key found')

    console.log('Parsing request body...')
    const requestBody = await req.text()
    console.log('Raw request body:', requestBody)
    
    let body
    try {
      body = JSON.parse(requestBody)
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    const { amount, currency = 'usd', courseId, customerEmail } = body
    console.log('Parsed parameters:', { amount, currency, courseId, customerEmail })

    if (!amount || !courseId) {
      console.error('Missing required parameters')
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: amount and courseId' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    console.log('Initializing Stripe...')
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    })
    console.log('Stripe initialized successfully')

    console.log('Creating payment intent...')
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe работает с центами
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        courseId,
        ...(customerEmail && { customerEmail }),
      },
    })
    console.log('Payment intent created:', paymentIntent.id)

    const response = {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }
    console.log('Returning response:', response)

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('=== ERROR IN CREATE PAYMENT INTENT ===')
    console.error('Error type:', typeof error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Full error object:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: 'Check function logs for more information'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
