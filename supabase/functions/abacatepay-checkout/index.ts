import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

interface CheckoutRequest {
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    taxId: string;
    cellphone: string;
  };
  paymentMethod: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  returnUrl: string;
  completionUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ABACATEPAY_API_KEY = Deno.env.get('ABACATEPAY_API_KEY');
    
    if (!ABACATEPAY_API_KEY) {
      throw new Error('AbacatePay API Key não configurada');
    }

    const { items, customer, paymentMethod, returnUrl, completionUrl }: CheckoutRequest = await req.json();

    // Validate request
    if (!items || items.length === 0) {
      throw new Error('Carrinho vazio');
    }

    if (!customer || !customer.name || !customer.email || !customer.taxId) {
      throw new Error('Dados do cliente incompletos');
    }

    // Calculate total and prepare products for AbacatePay
    const products = items.map((item, index) => ({
      externalId: item.id || `product-${index}`,
      name: item.name,
      quantity: item.quantity,
      price: Math.round(item.price * 100), // AbacatePay expects price in cents
      description: item.description || item.name,
    }));

    // Map payment methods
    const methodsMap: Record<string, string[]> = {
      'PIX': ['PIX'],
      'CREDIT_CARD': ['CREDIT_CARD'],
      'BOLETO': ['BOLETO'],
    };

    const methods = methodsMap[paymentMethod] || ['PIX'];

    // Create billing via AbacatePay API
    const billingResponse = await fetch('https://api.abacatepay.com/v1/billing/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ABACATEPAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        frequency: 'ONE_TIME',
        methods: methods,
        products: products,
        returnUrl: returnUrl,
        completionUrl: completionUrl,
        customer: {
          name: customer.name,
          email: customer.email,
          taxId: customer.taxId.replace(/\D/g, ''), // Remove formatting
          cellphone: customer.cellphone?.replace(/\D/g, '') || '',
        },
      }),
    });

    const billingData = await billingResponse.json();

    if (!billingResponse.ok) {
      console.error('AbacatePay error:', billingData);
      throw new Error(billingData.error || billingData.message || 'Erro ao criar cobrança');
    }

    return new Response(JSON.stringify({
      success: true,
      billing: billingData,
      checkoutUrl: billingData.url,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro interno do servidor',
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
