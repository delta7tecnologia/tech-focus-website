import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!ABACATEPAY_API_KEY) {
      throw new Error('AbacatePay API Key não configurada');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { items, customer, paymentMethod, returnUrl, completionUrl }: CheckoutRequest = await req.json();

    // Validate request
    if (!items || items.length === 0) {
      throw new Error('Carrinho vazio');
    }

    if (!customer || !customer.name || !customer.email || !customer.taxId) {
      throw new Error('Dados do cliente incompletos');
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = paymentMethod === 'PIX' ? subtotal * 0.05 : 0;
    const total = subtotal - discount;

    // Prepare products for AbacatePay (with discount applied if PIX)
    const products = items.map((item, index) => ({
      externalId: item.id || `product-${index}`,
      name: item.name,
      quantity: item.quantity,
      price: Math.round((paymentMethod === 'PIX' ? item.price * 0.95 : item.price) * 100), // AbacatePay expects price in cents
      description: item.description || item.name,
    }));

    // Map payment methods - AbacatePay only supports PIX and BOLETO
    const methodsMap: Record<string, string[]> = {
      'PIX': ['PIX'],
      'BOLETO': ['BOLETO'],
    };

    // Default to PIX if unsupported method
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

    // Save order to database
    const paymentId = billingData.data?.id || billingData.id;
    const paymentUrl = billingData.data?.url || billingData.url;

    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_tax_id: customer.taxId,
        customer_phone: customer.cellphone,
        payment_method: paymentMethod,
        payment_status: 'pending',
        payment_id: paymentId,
        payment_url: paymentUrl,
        subtotal: subtotal,
        discount: discount,
        total: total,
        items: items,
      });

    if (orderError) {
      console.error('Error saving order:', orderError);
      // Don't throw - payment was successful, just log the error
    }

    return new Response(JSON.stringify({
      success: true,
      billing: billingData,
      checkoutUrl: paymentUrl,
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
